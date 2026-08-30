'use client';

import { useState } from 'react';
import api from '@/lib/api';
import useStore from '@/store/useStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

const CreateProject = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { addProject } = useStore();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/projects', formData);
      addProject(response.data.data);
      setFormData({ name: '', description: '' });
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        
        <Input
          label="Project Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter project name"
          required
        />
        
        <Input
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter project description (optional)"
        />
        
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProject;
