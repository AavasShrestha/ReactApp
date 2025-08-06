
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Document, ApiError } from '../types';
import { documentApi } from '../services/api';
import DocumentList from './DocumentList';
import { 
  Search, 
  Filter, 
  Loader2, 
  AlertCircle, 
  RefreshCw,
  X
} from 'lucide-react';

const DocumentsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get('clientId');
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique document types for filter dropdown
  const documentTypes = Array.from(
    new Set(documents.map(doc => doc.documentType).filter(Boolean))
  ).sort();

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      setError('');
      const fetchedDocuments = await documentApi.getDocuments();
      setDocuments(fetchedDocuments);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleRetry = () => {
    fetchDocuments();
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const clearFilter = () => {
    setFilterType('');
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterType('');
  };

  const hasActiveFilters = searchTerm || filterType;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {clientId ? 'Client Documents' : 'Your Documents'}
              </h1>
              <p className="mt-2 text-gray-600">
                {clientId 
                  ? 'View documents for the selected client'
                  : 'View, search, and manage your uploaded documents'
                }
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
                  placeholder="Search documents..."
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

            {/* Filter Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors duration-200 ${
                  showFilters || filterType
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {filterType && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    1
                  </span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Expandable Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type
                  </label>
                  <select
                    id="documentType"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All types</option>
                    {documentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading documents...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">Error Loading Documents</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <button
                  onClick={handleRetry}
                  className="mt-3 text-sm text-red-800 hover:text-red-900 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Document List */}
        {!isLoading && !error && (
          <DocumentList 
            documents={documents}
            searchTerm={searchTerm}
            filterType={filterType}
          />
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;