import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Template from "@pages/Main/Template";
import { AuthLayout } from "@layouts/AuthLayout";
import { MainLayout } from "@layouts/MainLayout";

import Login from "@pages/AuthPages/Login";
import VerifyOtp from "@pages/AuthPages/VerifyOtp";
import CheckEmail from "@pages/AuthPages/CheckEmail";
import ResetPassword from "@pages/AuthPages/ResetPassword";
import PasswordUpdated from "@pages/AuthPages/PasswordUpdated";
import Dashboard from "@pages/Main/Dashboard";
import Users from "@pages/Main/Users";
import ReportLogs from "@pages/Main/ReportLogs";
import AiUsage from "@pages/Main/AiUsage";
import CreateReport from "@pages/Main/CreateReport";
import Reports from "@pages/Main/Reports";

import SystemMonitoring from "@pages/Main/SystemMonitoring";
import NewCase from "@pages/Main/NewCase";
import ReportView from "@pages/Main/ReportView";
import { PublicRoute } from "@routes/PublicRoute";
import { ProtectedRoute } from "@routes/ProtectedRoute";

import "./index.css";
import "react-datepicker/dist/react-datepicker.css";
import { ConfirmRoot } from "@components/Common/ConfirmRoot";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NotFound } from "@pages/Common/NotFound";
import PdfDebugPage from "@pages/PdfDebugPage";

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "/login", element: <Login /> },
          { path: "/verify-otp", element: <VerifyOtp /> },
          { path: "/check-email", element: <CheckEmail /> },
          { path: "/reset-password", element: <ResetPassword /> },
          { path: "/password-updated", element: <PasswordUpdated /> },
        ],
      },
    ],
  },


  {
    element: <ProtectedRoute allowedRoles={["SUPER_ADMIN", "DEV", "PROVIDER"]} />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/", element: <Dashboard /> },
          // { path: "/reports", element: <Reports /> },
          { path: "/report-logs", element: <ReportLogs /> },
          // { path: "/pdf", element: <PdfDebugPage /> },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRoles={["SUPER_ADMIN", "DEV"]} />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/templates", element: <Template /> },
          { path: "/ai-usage", element: <AiUsage /> },
          // { path: "/monitoring", element: <SystemMonitoring /> },
          { path: "/users", element: <Users /> },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRoles={["PROVIDER", "DEV"]} />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/create-report", element: <CreateReport /> },
          { path: "/report-view/:id", element: <ReportView /> },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/" replace />,
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ConfirmRoot />
      <ToastContainer />
    </>
  );
}

export default App;

// import { PdfPreview, type ReportResponse } from '@utils/pdfGenerator';

// const DevTestingPage = () => {
//   const mockData: ReportResponse = {
//     institution: {
//       name: "Compass Pain and Wellness",
//       address: "1901 E. 4th St. Suite 210, Santa Ana, CA. 92705",
//       phone: "(714) 542-5999",
//       fax: "(714) 475-6991"
//     },
//     patientInfo: {
//       name: "Albertina Carachure",
//       dob: "1961-02-25",
//       gender: "Female",
//       date_of_injury: "2023-05-15",
//       claim_number: "CWC230622950",
//       employer: "Corona Orange Foods Holdings, LLC"
//     },
//     report: [
//       { title: "Reason for Evaluation", content: "The patient was referred for a comprehensive multidisciplinary evaluation..." }
//     ]
//   };

//   return (
//     <div className="p-4">
//       <h1>PDF Live Editor</h1>
//       <PdfPreview data={mockData} />
//     </div>
//   );
// };

// export default DevTestingPage
