import { GrowthBookProvider } from "@growthbook/growthbook-react";
import { ConfigProvider } from "antd";
import enUS from "antd/lib/locale/en_US";
import { CommandBar } from "components/misc/CommandBar";
import UpdateDialog from "components/mode-specific/desktop/UpdateDialog";
import AppModeInitializer from "hooks/AppModeInitializer";
import DBListeners from "hooks/DbListenerInit/DBListeners";
import LocalUserAttributesHelperComponent from "hooks/LocalUserAttributesHelperComponent";
import PreLoadRemover from "hooks/PreLoadRemover";
import ThirdPartyIntegrationsHandler from "hooks/ThirdPartyIntegrationsHandler";
import useGeoLocation from "hooks/useGeoLocation";
import isEmpty from "is-empty";
import DashboardLayout from "layouts/DashboardLayout";
import FullScreenLayout from "layouts/FullScreenLayout";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { submitAppDetailAttributes } from "utils/AnalyticsUtils.js";
import { growthbook } from "utils/feature-flag/growthbook";
import APP_CONSTANTS from "./config/constants";
// import RuleExecutionsSyncer from "hooks/RuleExecutionsSyncer";
import ExtensionContextInvalidationNotice from "components/misc/ExtensionContextInvalidationNotice";
import { LazyMotion, domMax } from "framer-motion";
import { useIsExtensionEnabled } from "hooks";
import ActiveWorkspace from "hooks/ActiveWorkspace";
import AuthHandler from "hooks/AuthHandler";
import FeatureUsageEvent from "hooks/FeatureUsageEvent";

const { PATHS } = APP_CONSTANTS;

const App = () => {
  const location = useLocation();

  useEffect(() => {
    // Load features asynchronously when the app renders
    growthbook.loadFeatures({ autoRefresh: true });
  }, []);

  useGeoLocation();
  useIsExtensionEnabled();
  // useBillingTeamsListener();
  // useInitializeNewUserSessionRecordingConfig();

  submitAppDetailAttributes();

  if (!isEmpty(window.location.hash)) {
    //Support legacy URL formats
    const hashURL = window.location.hash.split("/");
    const hashType = hashURL[0];
    const hashPath = hashURL[1];

    switch (hashType) {
      case PATHS.HASH.SHARED_LISTS:
        window.location.assign(PATHS.SHARED_LISTS.VIEWER.ABSOLUTE + "/" + hashPath);
        break;
      case PATHS.HASH.RULE_EDITOR:
        window.location.replace(PATHS.RULE_EDITOR.EDIT_RULE.ABSOLUTE + "/" + hashPath);
        break;

      default:
        break;
    }
  }

  return (
    <>
      <ExtensionContextInvalidationNotice />
      <AuthHandler />
      <PreLoadRemover />
      <AppModeInitializer />
      <DBListeners />
      {/* <RuleExecutionsSyncer /> */}
      <ActiveWorkspace />
      <ThirdPartyIntegrationsHandler />

      <ConfigProvider locale={enUS}>
        <GrowthBookProvider growthbook={growthbook}>
          <LocalUserAttributesHelperComponent />
          <FeatureUsageEvent />
          <LazyMotion features={domMax} strict>
            <div id="requestly-dashboard-layout">
              <CommandBar />
              {"/" + location.pathname.split("/")[1] === PATHS.LANDING ? (
                <FullScreenLayout />
              ) : (
                <>
                  <UpdateDialog />
                  <DashboardLayout />
                </>
              )}
            </div>
          </LazyMotion>
        </GrowthBookProvider>
      </ConfigProvider>
    </>
  );
};

export default App;
