import Event from '../models/Event.js';

// Get todos los eventos (solo fecha e ID)
export const getAllEventsBasic = async (req, res) => {
  try {
    const events = await Event.find({}, 'date _id').sort({ date: 1 });
    res.json({
      success: true,
      events
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los eventos' });
  }
};

// Get evento por ID (todos los datos)
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    res.json({
      success: true,
      event
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el evento' });
  }
};
export const getTwoLatestEvents = async (req, res) => {
  try {
    const latestEvents = await Event.find()
      .select('title description date') // Selecciona solo estos campos
      .sort({ date: -1 }) // Orden descendente por fecha
      .limit(2); // Limitar a 2 resultados

    res.json({
      success: true,
      events: latestEvents,
      message: 'Últimos 2 eventos ordenados por fecha'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener los eventos',
      error: error.message
    });
  }
};
// Post para crear evento (sin imágenes)
export const createEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    
    const newEvent = new Event({
      title,
      description,
      date: new Date(date)
    });

    const savedEvent = await newEvent.save();
    res.status(201).json({
      success: true,
      event: savedEvent
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear evento' });
  }
};

// Put para actualizar evento (sin imágenes)
export const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({
      success: true,
      event: updatedEvent
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar evento' });
  }
};