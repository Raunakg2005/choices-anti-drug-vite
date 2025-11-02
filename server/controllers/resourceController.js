import Resource from '../models/Resource.js';
import { scrapeResources, scrapeVideos } from '../services/scraper.js';

// Get all resources
export const getResources = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'all' ? { category, isActive: true } : { isActive: true };
    
    const resources = await Resource.find(filter).sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resources', error: error.message });
  }
};

// Refresh resources by scraping
export const refreshResources = async (req, res) => {
  try {
    // Scrape new resources
    const scrapedResources = await scrapeResources();
    
    // Update or create resources
    const bulkOps = scrapedResources.map(resource => ({
      updateOne: {
        filter: { link: resource.link },
        update: { 
          $set: { 
            ...resource, 
            lastVerified: new Date() 
          } 
        },
        upsert: true
      }
    }));

    await Resource.bulkWrite(bulkOps);
    
    const resources = await Resource.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ 
      message: 'Resources refreshed successfully', 
      count: resources.length,
      resources 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error refreshing resources', error: error.message });
  }
};

// Get videos
export const getVideos = async (req, res) => {
  try {
    const videos = scrapeVideos();
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching videos', error: error.message });
  }
};

// Add custom resource (admin only)
export const addResource = async (req, res) => {
  try {
    const { title, link, description, category, source } = req.body;
    
    const resource = new Resource({
      title,
      link,
      description,
      category,
      source
    });
    
    await resource.save();
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Error adding resource', error: error.message });
  }
};

// Delete resource (admin only)
export const deleteResource = async (req, res) => {
  try {
    await Resource.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting resource', error: error.message });
  }
};

export default {
  getResources,
  refreshResources,
  getVideos,
  addResource,
  deleteResource
};
