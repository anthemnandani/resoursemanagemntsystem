import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
const ViewDetailsModal = ({
  isOpen,
  onClose,
  data,
  hiddenFields,
  title = "Details",
}) => {
  if (!isOpen || !data) return null;
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold mb-4 text-black">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 text-xl hover:text-gray-700"
          >
            <RxCross1 />
          </button>
        </div>

        <div className="space-y-3">
          {Object.entries(data).map(([key, value]) => {
            if (hiddenFields.includes(key)) return null;

            return (
              <div key={key}>
                <p className="text-sm text-gray-500 font-medium capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </p>
                <p className="text-gray-800 whitespace-pre-wrap break-words">
                  {Array.isArray(value) && value[0]?.url ? (
                    <div className="flex flex-wrap gap-3">
                      {value.map((fileObj, idx) => {
                        const isImage = /\.(jpeg|jpg|gif|png|webp)$/i.test(
                          fileObj.url
                        );
                        const isPDF =
                          /\.pdf$/i.test(fileObj.url) ||
                          fileObj.url.includes("/raw/upload/");
                        return isImage ? (
                          <img
                            key={idx}
                            src={fileObj.url}
                            alt={`media-${idx}`}
                            onClick={() => setSelectedImage(fileObj.url)}
                            className="w-24 h-24 object-cover roundedrder cursor-pointer hover:opacity-80"
                          />
                        ) : isPDF ? (
                          <a
                            key={idx}
                            href={fileObj.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 underline text-sm font-medium"
                          >
                            📄 View Document {idx + 1}
                          </a>
                        ) : (
                          <a
                            key={idx}
                            href={fileObj.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 underline text-sm font-medium"
                          >
                            🔗 Open File
                          </a>
                        );
                      })}
                    </div>
                  ) : typeof value === "object" &&
                    value?.url &&
                    /\.(jpeg|jpg|gif|png|webp)$/i.test(value.url) ? (
                    <img
                      src={value.url}
                      alt="media"
                      onClick={() => setSelectedImage(value.url)}
                      className="w-24 h-24 object-cover rounded border cursor-pointer hover:opacity-80"
                    />
                  ) : typeof value === "string" &&
                    /\.(jpeg|jpg|gif|png|webp)$/i.test(value) ? (
                    <img
                      src={value}
                      alt="preview"
                      onClick={() => setSelectedImage(value)}
                      className="w-24 h-24 object-cover rounded border cursor-pointer hover:opacity-80"
                    />
                  ) : typeof value === "string" && /\.pdf$/i.test(value) ? (
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 underline text-sm font-medium"
                    >
                      📄 View PDF
                    </a>
                  ) : typeof value === "string" &&
                    value.match(/^\d{4}-\d{2}-\d{2}T/) ? (
                    new Date(value).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  ) : typeof value === "object" && value !== null ? (
                    value.name ||
                    value.title ||
                    value.label ||
                    value.url ||
                    JSON.stringify(value, null, 2)
                  ) : (
                    value?.toString()
                  )}
                </p>
                <hr className="my-2 text-gray-100" />
              </div>
            );
          })}
        </div>
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/50 bg-opacity-80 flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            <img
              src={selectedImage}
              alt="Full Preview"
              className="max-w-full max-h-full p-8 rounded-lg shadow-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDetailsModal;
