import { MdLinkOff } from "react-icons/md";
import { AiOutlineArrowLeft, AiOutlineLineChart, AiOutlinePlusSquare, AiOutlineAppstore } from 'react-icons/ai';
import { MdReportProblem } from 'react-icons/md';
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pt-10">
      
      {/* Main Content */}
      <div className="grow flex flex-col items-center justify-center px-4 text-center">
        
        {/* Icon Besar */}
        <div className="relative mb-6">
          <div className="bg-gray-100 rounded-full p-10">
            <MdLinkOff className="text-gray-400 text-6xl" />
          </div>
          <div className="absolute top-0 right-0 bg-blue-600 p-1 rounded-md">
            <MdReportProblem className="text-white text-sm" />
          </div>
        </div>

        {/* Judul */}
        <h1 className="text-blue-600 text-4xl font-bold mb-2">404</h1>
        <h2 className="text-gray-900 text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-600 max-w-md mb-8">
          The page you're looking for doesn't exist. It may have been moved, deleted, or the link might be broken.
        </p>

        {/* Button */}
        <div className="flex gap-4 mb-12">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center gap-2"
            onClick={() => navigate('/dashboard')}
          >
            <AiOutlineArrowLeft /> Go to Dashboard
          </button>
          <button className="bg-white border border-gray-200 text-blue-600 px-6 py-2 rounded-md">
            Report an Issue
          </button>
        </div>

        {/* Grid card bawah */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {/* card 1 */}
          <div className="bg-white border border-gray-100 p-6 rounded-lg text-left">
            <AiOutlineLineChart className="text-blue-600 text-2xl mb-3" />
            <h3 className="font-bold text-gray-800">Check Analytics</h3>
            <p className="text-gray-500 text-sm">Track your active links and traffic sources in real-time.</p>
          </div>

          {/* card 2 */}
          <div className="bg-white border border-gray-100 p-6 rounded-lg text-left">
            <AiOutlinePlusSquare className="text-blue-600 text-2xl mb-3" />
            <h3 className="font-bold text-gray-800">New ShortLink</h3>
            <p className="text-gray-500 text-sm">Create a brand new architected URL in seconds.</p>
          </div>

          {/* card 3 */}
          <div className="bg-white border border-gray-100 p-6 rounded-lg text-left">
            <AiOutlineAppstore className="text-blue-600 text-2xl mb-3" />
            <h3 className="font-bold text-gray-800">Developer API</h3>
            <p className="text-gray-500 text-sm">Integrate our link infrastructure into your apps.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer showFull/>

    </div>
  );
};

export default NotFoundPage;
