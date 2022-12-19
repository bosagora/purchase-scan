import { RouterPathEnum } from "./RouterPathEnum";
import PageNotFound from "../../pages/PageNotFound/PageNotFound";
import Transactions from "../../pages/Transactions/Transactions";
import BlockDetails from "../../pages/Blocks/BlockDetails/BlockDetails";
import Dashboard from "../../pages/Dashboard/Dashboard";
import TransactionOverview from "../../pages/Transactions/TransactionOverview/TransactionOverview";
import SearchDetails from "../../pages/SearchDetails/SearchDetails";
import transactions from "../../pages/Transactions/Transactions";
import dashboard from "../../pages/Dashboard/Dashboard";
import Blocks from "../../pages/Blocks/Blocks";
import blocks from "../../pages/Blocks/Blocks";

const menuDefine = [
  {
    component: Dashboard,
    path: RouterPathEnum.HOME,
    title: "Dashboard",
    name: "Dashboard",
    type: "public",
    menubar: true,
    icon: dashboard,
  },
  {
    component: Blocks,
    path: RouterPathEnum.BLOCKS,
    title: "Blocks",
    name: "Blocks",
    latest_height: "12,235",
    type: "private",
    menubar: true,
    icon: blocks,
  },
  {
    component: Transactions,
    path: RouterPathEnum.TRANSACTIONS,
    title: "Transactions",
    name: "Transactions",
    latest_height: "12,235,453",
    type: "private",
    menubar: true,
    icon: transactions,
  },
  {
    component: SearchDetails,
    path: RouterPathEnum.SEARCH_DETAILS,
    title: "Search Details",
    name: "Search Details",
    type: "private",
    menubar: false,
  },
];

export default menuDefine;