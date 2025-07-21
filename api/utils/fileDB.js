const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

// This is a simple file-based database for development
class FileDB {
  constructor() {
    this.basePath = path.join(process.cwd(), 'db');
    this.init();
  }

  async init() {
    if (!fs.existsSync(this.basePath)) {
      try {
        await fsPromises.mkdir(this.basePath);
      } catch (error) {
        console.error('Error creating DB directory:', error);
      }
    }
  }

  getFilePath(collection) {
    return path.join(this.basePath, `${collection}.json`);
  }

  async readCollection(collection) {
    try {
      const filePath = this.getFilePath(collection);
      
      if (!fs.existsSync(filePath)) {
        return [];
      }
      
      const data = await fsPromises.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${collection}:`, error);
      return [];
    }
  }

  async writeCollection(collection, data) {
    try {
      const filePath = this.getFilePath(collection);
      await fsPromises.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error writing ${collection}:`, error);
    }
  }

  async find(collection, query = {}) {
    const data = await this.readCollection(collection);
    
    // Simple query filtering
    if (Object.keys(query).length === 0) {
      return data;
    }
    
    return data.filter(item => {
      for (const [key, value] of Object.entries(query)) {
        if (item[key] !== value) {
          return false;
        }
      }
      return true;
    });
  }

  async findById(collection, id) {
    const data = await this.readCollection(collection);
    return data.find(item => item._id === id);
  }

  async insert(collection, document) {
    const data = await this.readCollection(collection);
    
    // Generate a simple ID if not provided
    if (!document._id) {
      document._id = Date.now().toString();
    }
    
    data.push(document);
    await this.writeCollection(collection, data);
    return document;
  }

  async update(collection, id, updates) {
    const data = await this.readCollection(collection);
    const index = data.findIndex(item => item._id === id);
    
    if (index === -1) {
      return null;
    }
    
    data[index] = { ...data[index], ...updates };
    await this.writeCollection(collection, data);
    return data[index];
  }

  async delete(collection, id) {
    const data = await this.readCollection(collection);
    const filteredData = data.filter(item => item._id !== id);
    
    if (filteredData.length === data.length) {
      return false; // Nothing was deleted
    }
    
    await this.writeCollection(collection, filteredData);
    return true;
  }
}

module.exports = new FileDB();
