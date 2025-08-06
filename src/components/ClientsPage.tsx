import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Loader2, 
  AlertCircle, 
  RefreshCw,
  X,
  ChevronUp,
  ChevronDown,
  Users
} from 'lucide-react';
import { Client, ApiError } from '../types';
import { clientApi } from '../services/api';

const ClientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Client>('ClientName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      setError('');
      const fetchedClients = await clientApi.getClients();
      setClients(fetchedClients);
      setFilteredClients(fetchedClients);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to load clients');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Filter and sort clients
  useEffect(() => {
    let filtered = [...clients];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.ClientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.OrganizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.Mobile.includes(searchTerm) ||
        client.Country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.City.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.Description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

    setFilteredClients(filtered);
  }, [clients, searchTerm, sortField, sortDirection]);

  const handleRetry = () => {
    fetchClients();
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const clearFilters = () => {
    setSearchTerm('');
  };

  const handleSort = (field: keyof Client) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleClientClick = (clientId: string) => {
    navigate(`/documents?clientId=${clientId}`);
  };

  const getSortIcon = (field: keyof Client) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const hasActiveFilters = searchTerm;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading clients...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Clients</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
              <p className="mt-2 text-gray-600">
                Manage and view all your clients
              </p>
            </div>
            
            <button
              onClick={handleRetry}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search Input */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Controls (none for now) */}
            <div className="flex items-center space-x-4">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredClients.length} of {clients.length} clients
          </p>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('Id')}>
                    <div className="flex items-center space-x-1"><span>ID</span>{getSortIcon('Id')}</div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('ClientName')}>
                    <div className="flex items-center space-x-1"><span>Name</span>{getSortIcon('ClientName')}</div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('ClientType')}>
                    <div className="flex items-center space-x-1"><span>Type</span>{getSortIcon('ClientType')}</div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('OrganizationName')}>
                    <div className="flex items-center space-x-1"><span>Organization</span>{getSortIcon('OrganizationName')}</div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('Email')}>
                    <div className="flex items-center space-x-1"><span>Email</span>{getSortIcon('Email')}</div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('Mobile')}>
                    <div className="flex items-center space-x-1"><span>Mobile</span>{getSortIcon('Mobile')}</div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('Country')}>
                    <div className="flex items-center space-x-1"><span>Country</span>{getSortIcon('Country')}</div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('City')}>
                    <div className="flex items-center space-x-1"><span>City</span>{getSortIcon('City')}</div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('Gender')}>
                    <div className="flex items-center space-x-1"><span>Gender</span>{getSortIcon('Gender')}</div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('Description')}>
                    <div className="flex items-center space-x-1"><span>Description</span>{getSortIcon('Description')}</div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.Id} onClick={() => handleClientClick(client.Id.toString())} className="hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                    <td className="px-4 py-4 whitespace-nowrap">{client.Id}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{client.ClientName}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{client.ClientType}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{client.OrganizationName}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{client.Email}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{client.Mobile}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{client.Country}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{client.City}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{client.Gender}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{client.Description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
              <p className="text-gray-500">
                {hasActiveFilters 
                  ? 'Try adjusting your search or filters to find what you\'re looking for.'
                  : 'No clients have been added yet.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientsPage; 