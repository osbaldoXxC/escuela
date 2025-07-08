import Teacher from '../models/Teacher.js';
import { uploadImage, deleteImage } from '../libs/cloudinary.js';
import fs from 'fs-extra';

// Obtener todos los maestros
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      teachers
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener los maestros',
      error: error.message
    });
  }
};

// Crear nuevo maestro
export const createTeacher = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'Se requiere una imagen' 
      });
    }

    // Subir imagen a Cloudinary
    const image = await uploadImage(req.file.path);
    await fs.unlink(req.file.path); // Eliminar archivo temporal

    const newTeacher = new Teacher({
      name,
      description,
      image
    });

    const savedTeacher = await newTeacher.save();
    res.status(201).json({
      success: true,
      teacher: savedTeacher
    });
  } catch (error) {
    // Limpiar archivo en caso de error
    if (req.file) {
      await fs.unlink(req.file.path);
    }
    res.status(500).json({ 
      success: false,
      message: 'Error al crear el maestro',
      error: error.message
    });
  }
};

// Actualizar maestro
export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const currentTeacher = await Teacher.findById(id);

    if (!currentTeacher) {
      return res.status(404).json({
        success: false,
        message: 'Maestro no encontrado'
      });
    }

    const updateData = {
      name: name || currentTeacher.name,
      description: description || currentTeacher.description
    };

    // Procesar imagen si se envió
    if (req.file) {
      // Eliminar imagen antigua de Cloudinary
      try {
        const publicId = currentTeacher.image.split('/').slice(-2).join('/').split('.')[0];
        await deleteImage(publicId);
      } catch (error) {
        console.error('Error al eliminar imagen:', error);
      }

      // Subir nueva imagen
      const image = await uploadImage(req.file.path);
      await fs.unlink(req.file.path);
      updateData.image = image;
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      teacher: updatedTeacher
    });
  } catch (error) {
    console.error('Error al actualizar maestro:', error);
    
    // Limpiar archivo temporal en caso de error
    if (req.file) {
      await fs.unlink(req.file.path);
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Error al actualizar el maestro',
      error: error.message
    });
  }
};