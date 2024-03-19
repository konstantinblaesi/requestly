import { Button, Col, Row } from "antd";
import { PremiumIcon } from "components/common/PremiumIcon";
import { PremiumFeature } from "features/pricing";
import { FeatureLimitType } from "hooks/featureLimiter/types";
import { useFeatureLimiter } from "hooks/featureLimiter/useFeatureLimiter";
import { trackRuleCreationWorkflowStartedEvent } from "modules/analytics/events/common/rules";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { RuleType } from "types/rules";
import { redirectToCreateNewRule } from "utils/RedirectionUtils";
import { getRuleDetails } from "../utils";
import "./ruleHeader.css";

interface RuleHeaderProps {
  selectedRuleType: RuleType;
}

const RuleHeader: React.FC<RuleHeaderProps> = ({ selectedRuleType }) => {
  const navigate = useNavigate();
  const { icon, name, subtitle, header } = useMemo(() => getRuleDetails(selectedRuleType), [selectedRuleType]);
  const { getFeatureLimitValue } = useFeatureLimiter();

  const featureName = `${selectedRuleType.toLowerCase()}_rule` as FeatureLimitType;
  const isPremiumRule = !getFeatureLimitValue(featureName);

  const handleCreateRuleClick = () => {
    trackRuleCreationWorkflowStartedEvent(selectedRuleType, "screen");
    redirectToCreateNewRule(navigate, selectedRuleType, "rule_selection");
  };

  return (
    <Row align="middle" className="rule-header" wrap={false}>
      <Col className="rule-header-icon" span={3}>
        {icon}
      </Col>
      <Col className="rule-header-name-container" span={18}>
        <Row>
          <div className="header">
            {name}
            {isPremiumRule ? <PremiumIcon featureType={featureName} source="rule_selection_screen" /> : null}
          </div>
        </Row>
        <Row className="text-gray line-clamp-2">{header?.description ?? subtitle}</Row>
      </Col>
      <Col span={3} className="ml-auto">
        <Row
          align="middle"
          justify="end"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <PremiumFeature
            onContinue={() => {
              handleCreateRuleClick();
            }}
            features={[featureName, FeatureLimitType.num_rules]}
            popoverPlacement="bottomLeft"
            featureName={`${name} rule`}
            source={selectedRuleType}
          >
            <Button size="large" type="primary">
              Create Rule
            </Button>
          </PremiumFeature>
        </Row>
      </Col>
    </Row>
  );
};

export default RuleHeader;
