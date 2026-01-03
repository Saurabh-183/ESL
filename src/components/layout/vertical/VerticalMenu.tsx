"use client";

// MUI Imports
import { useTheme } from "@mui/material/styles";

// Third-party Imports
import PerfectScrollbar from "react-perfect-scrollbar";

// Type Imports
import type { VerticalMenuContextProps } from "@menu/components/vertical-menu/Menu";

// Component Imports
import { Menu, MenuItem } from "@menu/vertical-menu";

// Hook Imports
import { useSettings } from "@core/hooks/useSettings";
import useVerticalNav from "@menu/hooks/useVerticalNav";

// Styled Component Imports
import StyledVerticalNavExpandIcon from "@menu/styles/vertical/StyledVerticalNavExpandIcon";

// Style Imports
import menuItemStyles from "@core/styles/vertical/menuItemStyles";
import menuSectionStyles from "@core/styles/vertical/menuSectionStyles";
import { useParams } from "next/navigation";

// Lucide React Icons
import {
  Store,
  Database,
  FileText,
  Shield,
  Settings,
  ClipboardList,
  ChevronRight,
  Circle,
  LayoutDashboard,
  Layers,
  BarChart3,
} from "lucide-react";

type RenderExpandIconProps = {
  open?: boolean;
  transitionDuration?: VerticalMenuContextProps["transitionDuration"];
};

type Props = {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void;
};

const RenderExpandIcon = ({
  open,
  transitionDuration,
}: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon
    open={open}
    transitionDuration={transitionDuration}
  >
    <ChevronRight size={16} />
  </StyledVerticalNavExpandIcon>
);

const VerticalMenu = ({ scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme();
  const verticalNavOptions = useVerticalNav();
  const { settings } = useSettings();
  const { isBreakpointReached } = useVerticalNav();

  // Vars
  const { transitionDuration } = verticalNavOptions;
  const params = useParams();
  const isOverview = params.storeId;

  let counterId, inventoryId;
  if (Object.keys(params).length !== 0) {
    if (params.id) {
      counterId = params.id[0];
    } else if (params.inventoryId) {
      inventoryId = params.inventoryId[0];
    }
  }

  const ScrollWrapper = isBreakpointReached ? "div" : PerfectScrollbar;

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: "bs-full overflow-y-auto overflow-x-hidden",
            onScroll: (container) => scrollMenu(container, false),
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: (container) => scrollMenu(container, true),
          })}
    >
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => (
          <RenderExpandIcon
            open={open}
            transitionDuration={transitionDuration}
          />
        )}
        renderExpandedMenuItemIcon={{
          icon: <Circle size={6} />,
        }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {!isOverview ? (
          <>
            <MenuItem  icon={<Store size={18} />}  href={`/admin/storemanagement`} > Store Management   </MenuItem>
            <MenuItem icon={<Database size={18} />} href={`/admin/systemData`}>  System Data</MenuItem>
            <MenuItem  icon={<FileText size={18} />}  href={`/admin/system_Template`} >   System Template </MenuItem>
            <MenuItem  icon={<Shield size={18} />}   href={`/admin/authority_Management`} >   Authority Management </MenuItem>
            <MenuItem  icon={<Settings size={18} />}  href={`/admin/system_settings`} > System Settings </MenuItem>
            <MenuItem   icon={<ClipboardList size={18} />}  href={`/admin/system_Record`}> System Record</MenuItem>
          </>
        ) : (
          <>
            <MenuItem  icon={<LayoutDashboard size={18} />}  href={`/admin/storemanagement/${params.storeId}/overview`}>  OverView </MenuItem>
            <MenuItem  icon={<Database size={18} />}  href={`/admin/storemanagement/${params.storeId}/store_data`}> Store Data </MenuItem>
            <MenuItem icon={<Layers size={18} />} href={`/admin/storemanagement/${params.storeId}/store_template`}>  Store Template</MenuItem>
            <MenuItem  icon={<Database size={18} />}  href={`/admin/storemanagement/${params.storeId}/store_gateway_management`}>  Gateway Management</MenuItem>
            <MenuItem  icon={<Database size={18} />}  href={`/admin/storemanagement/${params.storeId}/store_device_management`}>  Device Management</MenuItem>
            <MenuItem  icon={<Settings size={18} />}  href={`/admin/storemanagement/${params.storeId}/store_settings`}>  Store Settings</MenuItem>
            <MenuItem  icon={<BarChart3 size={18} />}  href={`/admin/storemanagement/${params.storeId}/statical_analysis`}>  Statical Analysis</MenuItem>
          </>
        )}
      </Menu>
    </ScrollWrapper>
  );
};

export default VerticalMenu;
