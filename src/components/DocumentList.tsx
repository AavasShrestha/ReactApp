import React from 'react';
import { Document } from '../types';
import DocumentItem from './DocumentItem';
import { FileText } from 'lucide-react';

interface DocumentListProps {
  documents: Document[];
  searchTerm: string;
  filterType: string;
}

const DocumentList: React.FC<DocumentListProps> = ({ 
  documents, 
  searchTerm, 
  filterType 
}) => {
  // Filter documents based on search term and type filter
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || doc.documentType?.toLowerCase().includes(filterType.toLowerCase());
    return matchesSearch && matchesType;
  });

  if (filteredDocuments.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {documents.length === 0 ? 'No documents found' : 'No matching documents'}
        </h3>
        <p className="text-gray-500">
          {documents.length === 0 
            ? 'Upload some documents to get started.'
            : 'Try adjusting your search or filter criteria.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {filteredDocuments.length} of {documents.length} documents
      </div>

      {/* Document grid */}
      <div className="grid gap-4">
        {filteredDocuments.map((document) => (
          <DocumentItem key={document.id} document={document} />
        ))}
      </div>
    </div>
  );
};

export default DocumentList;