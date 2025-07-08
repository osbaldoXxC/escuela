import News from '../models/News.js';
import { uploadImage, deleteImage } from '../libs/cloudinary.js';
import fs from 'fs-extra';
export const getLatestNews = async (req, res) => {
  try {
    const latestNews = await News.find()
      .sort({ newsDate: -1 }) // Ordenar por fecha descendente
      .limit(5); // Limitar a 5 resultados

    res.json({
      success: true,
      news: latestNews,
      message: 'Últimas 5 noticias'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener las noticias',
      error: error.message
    });
  }
};

// Obtener las siguientes 5 noticias
export const getNextNews = async (req, res) => {
  try {
    const { lastDate } = req.query; // Recibimos la fecha de la última noticia del primer grupo

    if (!lastDate) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere la fecha de la última noticia recibida'
      });
    }

    const nextNews = await News.find({
      newsDate: { $lt: new Date(lastDate) } // Noticias más antiguas que la última recibida
    })
    .sort({ newsDate: -1 })
    .limit(5);

    res.json({
      success: true,
      news: nextNews,
      message: 'Siguientes 5 noticias'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener las noticias',
      error: error.message
    });
  }
};
// Get todas las noticias ordenadas por fecha personalizada
export const getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ newsDate: -1 });
    res.json({
      success: true,
      news
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener noticias',
      error: error.message
    });
  }
};

// Obtener las 3 noticias más recientes ordenadas por fecha
export const getThreeLatestNews = async (req, res) => {
  try {
    const latestNews = await News.find()
      .sort({ newsDate: -1 }) // Orden descendente por newsDate
      .limit(3); // Limitar a 3 resultados

    res.json({
      success: true,
      news: latestNews,
      message: 'Últimas 3 noticias ordenadas por fecha'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener las noticias',
      error: error.message
    });
  }
};
// Crear noticia con fecha personalizada
export const createNews = async (req, res) => {
  try {
    const { title, description, newsDate } = req.body;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Se requieren imágenes' 
      });
    }

    if (!newsDate) {
      return res.status(400).json({
        success: false,
        message: 'La fecha de la noticia es requerida'
      });
    }

    const images = await Promise.all(
      req.files.map(async file => {
        const result = await uploadImage(file.path);
        await fs.unlink(file.path);
        return result;
      })
    );

    const newNews = new News({
      title,
      description,
      images,
      newsDate: new Date(newsDate)
    });

    const savedNews = await newNews.save();
    res.status(201).json({
      success: true,
      news: savedNews
    });
  } catch (error) {
    if (req.files) {
      await Promise.all(req.files.map(file => fs.unlink(file.path)));
    }
    res.status(500).json({ 
      success: false,
      message: 'Error al crear noticia',
      error: error.message
    });
  }
};

// Actualizar noticia (incluyendo fecha)
export const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, newsDate } = req.body;
    const currentNews = await News.findById(id);

    if (!currentNews) {
      return res.status(404).json({
        success: false,
        message: 'Noticia no encontrada'
      });
    }

    const updateData = {
      title: title || currentNews.title,
      description: description || currentNews.description,
      newsDate: newsDate ? new Date(newsDate) : currentNews.newsDate
    };

    if (req.files && req.files.length > 0) {
      await Promise.all(
        currentNews.images.map(async imageUrl => {
          try {
            const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
            await deleteImage(publicId);
          } catch (error) {
            console.error('Error al eliminar imagen:', error);
          }
        })
      );

      const newImages = await Promise.all(
        req.files.map(async file => {
          try {
            const result = await uploadImage(file.path);
            await fs.unlink(file.path);
            return result;
          } catch (error) {
            await fs.unlink(file.path);
            throw error;
          }
        })
      );

      updateData.images = newImages;
    } else {
      updateData.images = currentNews.images;
    }

    const updatedNews = await News.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      news: updatedNews
    });
  } catch (error) {
    console.error('Error al actualizar noticia:', error);
    
   
    res.status(500).json({ 
      success: false,
      message: 'Error al actualizar noticia',
      error: error.message
    });
  }
};