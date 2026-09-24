import React from 'react';
import FileCard from './FileCard';

export default function FileGrid({ files, onDownload, onInspect, onDelete }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {files.map((file) => {
        const fileId = file.id || file._id;
        return (
          <FileCard
            key={fileId}
            file={file}
            onDownload={onDownload}
            onInspect={onInspect}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
}
