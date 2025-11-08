import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import Package from './pages/Packege';

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Login from './pages/Login';
import Product from './pages/Product';
import Measering from './pages/mesering/Measering';

import Setting from './pages/settings/Setting';
import Addmachine from './pages/settings/Addmachine';
import Addpartname from './pages/settings/Addpartname';

import LoginSetting from './pages/LoginSetting';
import ToolNumber from './pages/ToolNumber';
import HomeQC from './pages/HomeQC';
import ToolNumberQC from './pages/qctoollist/ToolNumberQC';
import Addprocess from './pages/settings/Addprocess';
import Register from './pages/settings/Register';
import ToolQCSearch from './pages/qctoollist/ToolQCSearch';
import ToolNumberSearch from './pages/ToolNumberSearch';
import Home from './pages/Home';
import History from './pages/settings/History';

import SleeveRWD1Finals from "./pages/masterpdf/chmachine/SleeveRWD1Finals";
import SelectMachine from "./pages/selectmachines/SelectMachine";
import ShowMasterRecordRWD1 from "./pages/masterpdf/chmachine/ShowMasterRecordRWD1";

import MachineCH154 from "./pages/selectmachines/MachineCH154";

import HistoryImages from './pages/settings/HistoryImages';

import AddPdfMachineCSAllModelInput from './pages/masterpdf/chmachine/AddPdfMachineCSAllModelInput';
import MachineCS from './pages/selectmachines/MachineCS';
import AddPdfMachineSBAllModelInput from './pages/masterpdf/chmachine/AddPdfMachineSBAllModelInput';
import MachineSB from './pages/selectmachines/MachineSB';
import AddmachineType from './pages/settings/AddmachineType';
import SettingForQc from './pages/settings/SettingForQc';
import LoginSettingQc from './pages/LoginSettingQc';
import RegisterForQc from './pages/settings/RegisterForQc';
import HistoryImagesForQc from './pages/settings/HistoryImagesForQc';
import AddMasterSpecQcLine from './pages/settings/AddMasterSpecQcLine';
import ProductShaft from './pages/ProductShaft';
import ToolNumberSearchShaft from './pages/ToolNumberSearchShaft';
import ProductSelect from './pages/ProductSelect';
import ToolNumberQCShaft from './pages/qctoollist/ToolNumberQCShaft';
import QCSelectCheck from './pages/qctoollist/QCSelectCheck';
import AddPdfMachineTNAllModelInput from './pages/masterpdf/chmachine/AddPdfMachineTNAllModelInput';
import MachineTN from './pages/selectmachines/MachineTN';

import AddPdfMachineCHAllModelInput from './pages/masterpdf/chmachine/AddPdfMachineCHAllModelInput';
import MachineCH from './pages/selectmachines/MachineCH';
import AddPdfMachineTBSAllModelInput from './pages/masterpdf/chmachine/AddPdfMachineTBSAllModelInput';
import MachineTBS from './pages/selectmachines/MachineTBS';
import AddPdfMachineTBMAllModelInput from './pages/masterpdf/chmachine/AddPdfMachineTBMAllModelInput';
import MachineTBM from './pages/selectmachines/MachineTBM';
import AddPdfMachineTTCAllModelInput from './pages/masterpdf/chmachine/AddPdfMachineTTCAllModelInput';
import MachineTTC from './pages/selectmachines/MachineTTC';
import AddPdfMachineTBAllModelInput from './pages/masterpdf/chmachine/AddPdfMachineTBAllModelInput';
import MachineTB from './pages/selectmachines/MachineTB';
import AddMasterToolNumber from './pages/settings/AddMasterToolNumber';
import AddmachineShaft from './pages/settings/AddmachineShaft';
import AddpartnameShaft from './pages/settings/AddpartnameShaft';
import AddMasterToolNumberSpec from './pages/settings/AddMasterToolNumberSpec';
import AddPdfMachineTCHAllModelInput from './pages/masterpdf/chmachine/AddPdfMachineTCHAllModelInput';
import MachineTCH from './pages/selectmachines/MachineTCH';
import AddMasterToolNumberSleeve from './pages/settings/AddMasterToolNumberSleeve';
import AddMasterToolNumberSpecSleeve from './pages/settings/AddMasterToolNumberSpecSleeve';
import ToolQCSearchShaft from './pages/qctoollist/ToolQCSearchShaft';
import RecordProduction from './pages/settings/RecordProduction';
import RecordProductionPageQC from './pages/settings/RecordProductionPageQC';
import AddMasterToolNumberCS from './pages/settings/AddMasterToolNumberCS';
import AddMasterToolNumberSpecCS from './pages/settings/AddMasterToolNumberSpecCS';
import ToolNumberSearchCS from './pages/ToolNumberSearchCS';
import AddMasterToolNumberTN from './pages/settings/AddMasterToolNumberTN';
import AddMasterToolNumberSpecTN from './pages/settings/AddMasterToolNumberSpecTN';
import ToolNumberSearchTN from './pages/ToolNumberSearchTN';
import AddMasterToolNumberTBM from './pages/settings/AddMasterToolNumberTBM';
import AddMasterToolNumberSpecTBM from './pages/settings/AddMasterToolNumberSpecTBM';
import ToolNumberSearchShaftTBM from './pages/ToolNumberSearchShaftTBM';
import AddMasterToolNumberTTC from './pages/settings/AddMasterToolNumberTTC';
import AddMasterToolNumberSpecTTC from './pages/settings/AddMasterToolNumberSpecTTC';
import ToolNumberSearchShaftTTC from './pages/ToolNumberSearchShaftTTC';
import AddMasterToolNumberTB from './pages/settings/AddMasterToolNumberTB';
import AddMasterToolNumberSpecTB from './pages/settings/AddMasterToolNumberSpecTB';
import ToolNumberSearchShaftTB from './pages/ToolNumberSearchShaftTB';
import AddMasterToolNumberTCH from './pages/settings/AddMasterToolNumberTCH';
import AddMasterToolNumberSpecTCH from './pages/settings/AddMasterToolNumberSpecTCH';
import ToolNumberSearchShaftTCH from './pages/ToolNumberSearchShaftTCH';
import AddMasterToolNumberSB from './pages/settings/AddMasterToolNumberSB';
import AddMasterToolNumberSpecSB from './pages/settings/AddMasterToolNumberSpecSB';
import ToolNumberSearchSB from './pages/ToolNumberSearchSB';
import ToolingFormAuditCH from './pages/settings/ToolingFormAuditCH';
import ToolingFormAuditTN from './pages/settings/ToolingFormAuditTN';
import ToolingFormAuditTBS from './pages/settings/ToolingFormAuditTBS';




import AdminDashboard from './pages/admin/adminDashboard';
import RecordNgTool from './pages/settings/RecordNgTool';
import SelectMachineForProduct from './pages/selectmachines/SelectMachineForProduct';
import MachineCHForProduct from './pages/selectmachines/MachineCHForProduct';
import MachineCSForProduct from './pages/selectmachines/MachineCSForProduct';
import MachineSBForProduct from './pages/selectmachines/MachineSBForProduct';
import MachineTNForProduct from './pages/selectmachines/MachineTNForProduct';
import MachineTBForProduct from './pages/selectmachines/MachineTBForProduct';
import MachineTBMForProduct from './pages/selectmachines/MachineTBMForProduct';
import MachineTBSForProduct from './pages/selectmachines/MachineTBSForProduct';
import MachineTTCForProduct from './pages/selectmachines/MachineTTCForProduct';
import MachineTCHForProduct from './pages/selectmachines/MachineTCHForProduct';
import AdminDashboardSelect from './pages/admin/AdminDashboardSelect';
import ToolNumberQCTN from './pages/qctoollist/ToolNumberQCTN';
import ToolNumberQCCS from './pages/qctoollist/ToolNumberQCCS';
import ToolNumberQCSB from './pages/qctoollist/ToolNumberQCSB';
import ToolNumberQCShaftTB from './pages/qctoollist/ToolNumberQCShaftTB';
import ToolNumberQCShaftTBM from './pages/qctoollist/ToolNumberQCShaftTBM';
import ToolNumberQCShaftTTC from './pages/qctoollist/ToolNumberQCShaftTTC';
import ToolNumberQCShaftTCH from './pages/qctoollist/ToolNumberQCShaftTCH';



const router = createBrowserRouter([
  {path: "/", element: <Package />,},
  {path: "/login", element: <Login />,},
  {path: "/home", element: <Home />,},

  {path: "/product", element: <Product />,},
  {path: "/productSelect", element: <ProductSelect />,},
  {path: "/qcSelectCheck", element: <QCSelectCheck />,},
  {path: "/homeqc", element: <HomeQC />,},

  {path: "/toolnumber", element: <ToolNumber />,},
  {path: "/toolNumberSearch", element: <ToolNumberSearch />,},
  {path: "/toolNumberSearchCSlist", element: <ToolNumberSearchCS />,},
  {path: "/toolNumberSearchSBlist", element: <ToolNumberSearchSB />,},
  {path: "/toolNumberSearchTNlist", element: <ToolNumberSearchTN />,},

  {path: "/toolNumberSearchShaft", element: <ToolNumberSearchShaft />,},
  {path: "/toolNumberSearchShaftTBM", element: <ToolNumberSearchShaftTBM />,},
  {path: "/toolNumberSearchShaftTTC", element: <ToolNumberSearchShaftTTC />,},
  {path: "/toolNumberSearchShaftTB", element: <ToolNumberSearchShaftTB />,},
  {path: "/toolNumberSearchShaftTCH", element: <ToolNumberSearchShaftTCH />,},

  {path: "/toolNumberQC", element: <ToolNumberQC />,},
  {path: "/toolNumberQCCS", element: <ToolNumberQCCS />,},
  {path: "/toolNumberQCSB", element: <ToolNumberQCSB />,},
  {path: "/toolNumberQCTN", element: <ToolNumberQCTN />,},


  {path: "/toolQCSearch", element: <ToolQCSearch />,},
  {path: "/toolQCSearchShaft", element: <ToolQCSearchShaft />,},

  {path: "/toolNumberQCShaft", element: <ToolNumberQCShaft />,},
  {path: "/toolNumberQCShaftTB", element: <ToolNumberQCShaftTB />,},
  {path: "/toolNumberQCShaftTBM", element: <ToolNumberQCShaftTBM />,},
  {path: "/toolNumberQCShaftTTC", element: <ToolNumberQCShaftTTC />,},
  {path: "/toolNumberQCShaftTCH", element: <ToolNumberQCShaftTCH />,},

  { path: "/measering", element: <Measering /> },
  { path: "/productShaft", element: <ProductShaft /> },
 

  { path: "/settings", element: <Setting /> },
  { path: "/settingsForQc", element: <SettingForQc /> },

  { path: "/loginsetting", element: <LoginSetting /> },
  { path: "/loginsettingForQc", element: <LoginSettingQc /> },

  { path: "/addmachine", element: <Addmachine /> },
  { path: "/addmachineShaft", element: <AddmachineShaft /> },
  { path: "/addmachineType", element: <AddmachineType /> },
  { path: "/addpartname", element: <Addpartname /> },
  { path: "/addpartnameShaft", element: <AddpartnameShaft /> },
 
  { path: "/addprocess", element: <Addprocess /> },
  { path: "/addMasterSpecQcLine", element: <AddMasterSpecQcLine /> },
  { path: "/addMasterToolNumber", element: <AddMasterToolNumber /> },
  { path: "/addMasterToolNumberSleeve", element: <AddMasterToolNumberSleeve /> },
  { path: "/addMasterToolNumberSpec", element: <AddMasterToolNumberSpec /> },
  { path: "/addMasterToolNumberSpecSleeve", element: <AddMasterToolNumberSpecSleeve /> },

  { path: "/addMasterToolNumberCS", element: <AddMasterToolNumberCS /> },
  { path: "/addMasterToolNumberSpecCS", element: <AddMasterToolNumberSpecCS /> },

  { path: "/addMasterToolNumberSB", element: <AddMasterToolNumberSB /> },
  { path: "/addMasterToolNumberSpecSB", element: <AddMasterToolNumberSpecSB /> },

  { path: "/addMasterToolNumberTN", element: <AddMasterToolNumberTN /> },
  { path: "/addMasterToolNumberSpecTN", element: <AddMasterToolNumberSpecTN /> },

  { path: "/addMasterToolNumberTBM", element: <AddMasterToolNumberTBM /> },
  { path: "/addMasterToolNumberSpecTBM", element: <AddMasterToolNumberSpecTBM /> },

  { path: "/addMasterToolNumberTTC", element: <AddMasterToolNumberTTC /> },
  { path: "/addMasterToolNumberSpecTTC", element: <AddMasterToolNumberSpecTTC /> },

  { path: "/addMasterToolNumberTB", element: <AddMasterToolNumberTB /> },
  { path: "/addMasterToolNumberSpecTB", element: <AddMasterToolNumberSpecTB /> },

  { path: "/addMasterToolNumberTCH", element: <AddMasterToolNumberTCH /> },
  { path: "/addMasterToolNumberSpecTCH", element: <AddMasterToolNumberSpecTCH /> },

  { path: "/register", element: <Register /> },
  { path: "/registerForQc", element: <RegisterForQc /> },


  { path: "/history", element: <History /> },
  { path: "/historyImages", element: <HistoryImages /> },
  { path: "/historyImagesForQc", element: <HistoryImagesForQc /> },
  { path: "/recordProduction", element: <RecordProduction /> },
  { path: "/recordProductionPageQC", element: <RecordProductionPageQC /> },

  { path: "/recordNgTool", element: <RecordNgTool /> },

  { path: "/SelectMachine", element: <SelectMachine /> },
  { path: "/MachineCH154", element: <MachineCH154 /> },
  { path: "/MachineCS", element: <MachineCS /> },
  { path: "/MachineSB", element: <MachineSB /> },
  { path: "/MachineTN", element: <MachineTN /> },
  { path: "/MachineCH", element: <MachineCH /> },
  { path: "/MachineTBS", element: <MachineTBS /> },
  { path: "/MachineTBM", element: <MachineTBM /> },
  { path: "/MachineTTC", element: <MachineTTC /> },
  { path: "/MachineTB", element: <MachineTB /> },
  { path: "/MachineTCH", element: <MachineTCH /> },

  { path: "/SelectMachineForProduct", element: <SelectMachineForProduct /> },
  { path: "/MachineCHForProduct", element: <MachineCHForProduct /> },
  { path: "/MachineCSForProduct", element: <MachineCSForProduct /> },
  { path: "/MachineSBForProduct", element: <MachineSBForProduct /> },
  { path: "/MachineTNForProduct", element: <MachineTNForProduct /> },

  { path: "/MachineTBSForProduct", element: <MachineTBSForProduct /> },
  { path: "/MachineTTCForProduct", element: <MachineTTCForProduct /> },
  { path: "/MachineTBForProduct", element: <MachineTBForProduct /> },
  { path: "/MachineTBMForProduct", element: <MachineTBMForProduct /> },
  { path: "/MachineTCHForProduct", element: <MachineTCHForProduct /> },

  { path: "/SleeveRWD1Finals", element: <SleeveRWD1Finals /> },


  { path: "/AddPdfMachineCSAllModelInput", element: <AddPdfMachineCSAllModelInput /> },
  { path: "/AddPdfMachineSBAllModelInput", element: <AddPdfMachineSBAllModelInput /> },
  { path: "/AddPdfMachineTNAllModelInput", element: <AddPdfMachineTNAllModelInput /> },
  { path: "/AddPdfMachineCHAllModelInput", element: <AddPdfMachineCHAllModelInput /> },

  { path: "/AddPdfMachineTBSAllModelInput", element: <AddPdfMachineTBSAllModelInput /> },
  { path: "/AddPdfMachineTBMAllModelInput", element: <AddPdfMachineTBMAllModelInput /> },
  { path: "/AddPdfMachineTTCAllModelInput", element: <AddPdfMachineTTCAllModelInput /> },
  { path: "/AddPdfMachineTBAllModelInput", element: <AddPdfMachineTBAllModelInput /> },
  { path: "/AddPdfMachineTCHAllModelInput", element: <AddPdfMachineTCHAllModelInput /> },

  { path: "/toolingFormAuditCH", element: <ToolingFormAuditCH /> },
  { path: "/toolingFormAuditTN", element: <ToolingFormAuditTN /> },
  { path: "/toolingFormAuditTBS", element: <ToolingFormAuditTBS /> },


  { path: "/AdminDashboard", element: <AdminDashboard /> },
  { path: "/AdminDashboardSelect", element: <AdminDashboardSelect /> },


  { path: "/ShowMasterRecordRWD1", element: <ShowMasterRecordRWD1 /> },




]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} />
);

reportWebVitals();
