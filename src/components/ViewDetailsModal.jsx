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
        <h2 className="text-xl font-bold mb-4 text-[#003cb3]">{title}</h2>
          <button onClick={onClose} className="text-gray-500 text-xl hover:text-gray-700">
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
                  {typeof value === "string" &&
                  value.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                    <img
                      src={value}
                      alt="preview"
                      onClick={() => setSelectedImage(value)}
                      className="w-32 h-32 object-cover rounded-lg border cursor-pointer hover:opacity-80"
                    />
                  ) : Array.isArray(value) && value[0]?.url ? (
                    <div className="flex flex-wrap gap-2">
                      {value.map((imgObj, idx) => (
                        <img
                          key={idx}
                          src={imgObj.url}
                          alt={`image-${idx}`}
                          onClick={() => setSelectedImage(imgObj.url)}
                          className="w-24 h-24 object-cover rounded border cursor-pointer hover:opacity-80"
                        />
                      ))}
                    </div>
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
                    value.url ||
                    value.label ||
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