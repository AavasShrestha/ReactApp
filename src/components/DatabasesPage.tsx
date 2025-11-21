import React, { useEffect, useState } from 'react';
import { Database, NewDatabase, ApiError } from '../types';
import { databaseApi } from '../services/api';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Loader2,
  AlertCircle,
  RefreshCw,
  Database as DatabaseIcon,
  Server,
  Eye,
  EyeOff
} from 'lucide-react';

const DatabasesPage: React.FC = () => {
  const [databases, setDatabases] = useState<Database[]>([]);
  const [filteredDatabases, setFilteredDatabases] = useState<Database[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingDatabase, setEditingDatabase] = useState<Database | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConnectionString, setShowConnectionString] = useState<{ [key: number]: boolean }>({});

  const [newDatabase, setNewDatabase] = useState<NewDatabase>({
    DatabaseName: '',
    ConnectionString: '',
    DatabaseType: '',
    ServerName: '',
    Port: 1433,
    IsActive: true
  });

  useEffect(() => {
    loadDatabases();
  }, []);

  useEffect(() => {
    filterDatabases();
  }, [databases, searchTerm]);

  const loadDatabases = async () => {
    try {
      setIsLoading(true);
      setError('');
      const databasesData = await databaseApi.getDatabases();
      setDatabases(databasesData || []);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to load databases');
      setDatabases([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterDatabases = () => {
    if (!searchTerm.trim()) {
      setFilteredDatabases(databases);
    } else {
      const filtered = databases.filter(db =>
        (db.DatabaseName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (db.ServerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (db.DatabaseType || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDatabases(filtered);
    }
  };

  const handleCreate = async () => {
    try {
      setIsSubmitting(true);
      await databaseApi.createDatabase(newDatabase);
      setNewDatabase({
        DatabaseName: '',
        ConnectionString: '',
        DatabaseType: '',
        ServerName: '',
        Port: 1433,
        IsActive: true
      });
      setShowCreateForm(false);
      loadDatabases();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to create database');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingDatabase) return;
    
    try {
      setIsSubmitting(true);
      await databaseApi.updateDatabase(editingDatabase.Id, editingDatabase);
      setEditingDatabase(null);
      loadDatabases();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to update database');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this database?')) return;
    
    try {
      await databaseApi.deleteDatabase(id);
      loadDatabases();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to delete database');
    }
  };

  const handleEdit = (database: Database) => {
    setEditingDatabase({ ...database });
  };

  const handleCancelEdit = () => {
    setEditingDatabase(null);
  };

  const handleFieldChange = (field: keyof Database, value: string | number | boolean) => {
    if (editingDatabase) {
      setEditingDatabase({ ...editingDatabase, [field]: value });
    }
  };

  const handleNewDatabaseFieldChange = (field: keyof NewDatabase, value: string | number | boolean) => {
    setNewDatabase({ ...newDatabase, [field]: value });
  };

  const toggleConnectionStringVisibility = (id: number) => {
    setShowConnectionString(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getDatabaseTypeColor = (type: string) => {
    switch ((type || '').toLowerCase()) {
      case 'sql server':
        return 'bg-blue-100 text-blue-800';
      case 'mysql':
        return 'bg-orange-100 text-orange-800';
      case 'postgresql':
        return 'bg-purple-100 text-purple-800';
      case 'oracle':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const maskConnectionString = (connectionString: string) => {
    if (!connectionString) return '';
    // Simple masking - replace password-like patterns
    return connectionString.replace(/password[^;]*/gi, 'password=***');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading databases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Database Management</h1>
              <p className="mt-2 text-gray-600">Manage your database connections and configurations</p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Database
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search databases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={loadDatabases}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Refresh
          </button>
        </div>

        {/* Create Database Form */}
        {showCreateForm && (
          <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Database</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Database Name *"
                value={newDatabase.DatabaseName}
                onChange={(e) => handleNewDatabaseFieldChange('DatabaseName', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newDatabase.DatabaseType}
                onChange={(e) => handleNewDatabaseFieldChange('DatabaseType', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Database Type</option>
                <option value="SQL Server">SQL Server</option>
                <option value="MySQL">MySQL</option>
                <option value="PostgreSQL">PostgreSQL</option>
                <option value="Oracle">Oracle</option>
              </select>
              <input
                type="text"
                placeholder="Server Name *"
                value={newDatabase.ServerName}
                onChange={(e) => handleNewDatabaseFieldChange('ServerName', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Port"
                value={newDatabase.Port || ''}
                onChange={(e) => handleNewDatabaseFieldChange('Port', parseInt(e.target.value) || 1433)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Connection String *"
                value={newDatabase.ConnectionString}
                onChange={(e) => handleNewDatabaseFieldChange('ConnectionString', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={isSubmitting || !newDatabase.DatabaseName || !newDatabase.ServerName || !newDatabase.ConnectionString}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />
                    Creating...
                  </>
                ) : (
                  'Create Database'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Databases Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Databases ({filteredDatabases.length})
            </h2>
          </div>
          
          {filteredDatabases.length === 0 ? (
            <div className="p-8 text-center">
              <DatabaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No databases found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Database
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Server
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Connection
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDatabases.map((database) => (
                    <tr key={database.Id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DatabaseIcon className="h-5 w-5 text-blue-500 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {database.DatabaseName}
                            </div>
                            {database.CreatedDate && (
                              <div className="text-sm text-gray-500">
                                Created: {new Date(database.CreatedDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Server className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm text-gray-900">{database.ServerName}</div>
                            {database.Port && (
                              <div className="text-sm text-gray-500">Port: {database.Port}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDatabaseTypeColor(database.DatabaseType)}`}>
                          {database.DatabaseType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900 font-mono max-w-xs truncate">
                            {showConnectionString[database.Id] 
                              ? database.ConnectionString 
                              : maskConnectionString(database.ConnectionString)
                            }
                          </span>
                          <button
                            onClick={() => toggleConnectionStringVisibility(database.Id)}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                          >
                            {showConnectionString[database.Id] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          database.IsActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {database.IsActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(database)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(database.Id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingDatabase && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Edit Database</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Database Name *"
                    value={editingDatabase.DatabaseName}
                    onChange={(e) => handleFieldChange('DatabaseName', e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={editingDatabase.DatabaseType}
                    onChange={(e) => handleFieldChange('DatabaseType', e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Database Type</option>
                    <option value="SQL Server">SQL Server</option>
                    <option value="MySQL">MySQL</option>
                    <option value="PostgreSQL">PostgreSQL</option>
                    <option value="Oracle">Oracle</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Server Name *"
                    value={editingDatabase.ServerName}
                    onChange={(e) => handleFieldChange('ServerName', e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Port"
                    value={editingDatabase.Port || ''}
                    onChange={(e) => handleFieldChange('Port', parseInt(e.target.value) || 1433)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    placeholder="Connection String *"
                    value={editingDatabase.ConnectionString}
                    onChange={(e) => handleFieldChange('ConnectionString', e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
                    rows={3}
                  />
                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editingDatabase.IsActive || false}
                        onChange={(e) => handleFieldChange('IsActive', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Active</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={isSubmitting || !editingDatabase.DatabaseName || !editingDatabase.ServerName || !editingDatabase.ConnectionString}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />
                        Updating...
                      </>
                    ) : (
                      'Update Database'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabasesPage;