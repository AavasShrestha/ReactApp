import React, { useState } from 'react';
import { Document } from '../types';
import { documentApi } from '../services/api';
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  FileType,
  X,
  ExternalLink
} from 'lucide-react';

interface DocumentItemProps {
  document: Document;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ document }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  // Get file extension and determine if it's previewable
  const getFileExtension = (fileName: string): string => {
    return fileName.split('.').pop()?.toLowerCase() || '';
  };

  const isPreviewable = (fileName: string): boolean => {
    const ext = getFileExtension(fileName);
    return ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext);
  };

  const getFileIcon = (fileName: string) => {
    const ext = getFileExtension(fileName);
    return <FileText className="h-5 w-5" />;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'Unknown size';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const handlePreview = () => {
    if (isPreviewable(document.fileName)) {
      setShowPreview(true);
      setPreviewError(false);
    }
  };

  const handleDownload = () => {
    const url = documentApi.getDocumentUrl(document.fileName);
    window.open(url, '_blank');
  };

  const fileUrl = documentApi.getDocumentUrl(document.fileName);
  const ext = getFileExtension(document.fileName);
  const canPreview = isPreviewable(document.fileName);

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            {/* File Icon */}
            <div className="p-2 bg-blue-50 rounded-lg">
              {getFileIcon(document.fileName)}
            </div>

            {/* File Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {document.fileName}
              </h3>
              
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <FileType className="h-4 w-4" />
                  <span>{document.documentType || ext.toUpperCase()}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(document.uploadedDate)}</span>
                </div>
                
                {document.fileSize && (
                  <span>{formatFileSize(document.fileSize)}</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 ml-4">
            {canPreview && (
              <button
                onClick={handlePreview}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors duration-200"
                title="Preview file"
              >
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </button>
            )}
            
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors duration-200"
              title="Download file"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl max-h-full w-full overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {document.fileName}
              </h3>
              
              <div className="flex items-center space-x-2">
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
                
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  title="Close preview"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 max-h-96 overflow-auto">
              {!previewError ? (
                ext === 'pdf' ? (
                  <embed
                    src={fileUrl}
                    type="application/pdf"
                    className="w-full h-96"
                    onError={() => setPreviewError(true)}
                  />
                ) : (
                  <img
                    src={fileUrl}
                    alt={document.fileName}
                    className="max-w-full h-auto mx-auto rounded-lg"
                    onError={() => setPreviewError(true)}
                  />
                )
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Unable to preview this file</p>
                  <button
                    onClick={handleDownload}
                    className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download instead</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentItem;