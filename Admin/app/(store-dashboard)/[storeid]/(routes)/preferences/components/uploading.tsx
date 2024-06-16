import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { XCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { PuffLoader } from 'react-spinners';

interface ImageUploadProps {
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const UploadingPage: React.FC<ImageUploadProps> = ({
  onChange,
  onRemove,
  value,
}) => {
  const params = useParams();
  const [isUploading, setIsUploading] = useState(false);
  const [image, setImage] = useState(value[0]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = async (ev: any) => {
    const files = ev.target?.files;
    const data = new FormData();
    if (files.length > 0) {
      setIsUploading(true);
      for (const file of files) {
        data.append('file', file);
      }
    }
    const response = await axios.post(
      `/api/${params.storeid}/billboards/uploads`,
      data,
    );
    onChange(response.data.link);
    setImage(response.data.link);
    value[0] = response.data.link;
    setIsUploading(false);
    ev.target.value = '';
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="mb-4 flex flex-wrap gap-2">
        {value[0] && (
          <div
            key={value[0]}
            className="relative h-24 border-2  items-center justify-center rounded-lg"
          >
            <img src={value[0]} alt="" className="max-h-[100%]" />
            <div
              className="absolute top-0 right-0 mb-2"
              onClick={() => {
                onRemove(value[0]);
                setImage('');
                value[0] = '';
              }}
            >
              <XCircle className="bg-red-500 w-5 h-5 cursor-pointer hover:opacity-70 rounded-full" />
            </div>
          </div>
        )}

        {isUploading && (
          <div className=" flex h-24 justify-center items-center">
            <PuffLoader />
          </div>
        )}
        <label
          className="w-24 h-24 border bg-gray-100 flex flex-col items-center justify-center hover:shadow-md rounded-lg
                        text-gray-400 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-7 h-7"
          >
            <path
              fillRule="evenodd"
              d="M10.5 3.75a6 6 0 00-5.98 6.496A5.25 5.25 0 006.75 20.25H18a4.5 4.5 0 002.206-8.423 3.75 3.75 0 00-4.133-4.303A6.001 6.001 0 0010.5 3.75zm2.03 5.47a.75.75 0 00-1.06 0l-3 3a.75.75 0 101.06 1.06l1.72-1.72v4.94a.75.75 0 001.5 0v-4.94l1.72 1.72a.75.75 0 101.06-1.06l-3-3z"
              clipRule="evenodd"
            />
          </svg>
          Upload
          {/* <input type="file" className="hidden" onChange={onUpload} /> */}
          <Input
            type="file"
            className="hidden"
            disabled={isUploading}
            onChange={onUpload}
          />
        </label>
      </div>
    </div>
  );
};

export default UploadingPage;
