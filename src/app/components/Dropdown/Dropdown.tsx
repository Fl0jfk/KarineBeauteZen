import { useState } from 'react';

interface DropdownProps {
  title: string;
  items: any[];
}

const Dropdown: React.FC<DropdownProps> = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleDropdown = () => setIsOpen(prev => !prev);
  return (
    <div>
      <button onClick={toggleDropdown} className="w-full text-left px-4 py-2 bg-rose-50 rounded-md flex items-center justify-between">
        {title}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      {isOpen && (
        <div className="mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-md bg-rose-50">
          <ul className='flex flex-col gap-4'>
            {items.map((item, index) => (
              <li key={item.id} className={`flex flex-col gap-1 p-1 ${index < items.length - 1 ? 'border-b border-gray-300' : ''}`}>
                <div className='flex justify-between'>
                    <h3 className='text-lg'>{item.title}</h3>{item.price}€
                </div>
                <p className='text-sm'>{item.time}</p>
                <p className='mb-4'>{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;

