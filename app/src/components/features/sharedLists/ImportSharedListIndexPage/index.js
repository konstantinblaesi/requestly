import { GlobalOutlined, ImportOutlined } from "@ant-design/icons";
import { Button, Card, Col, Input, Row, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isValidRQUrl } from "utils/FormattingHelper";
import { redirectToSharedListViewer } from "utils/RedirectionUtils";
import {
  fetchSharedListData,
  getSharedListIdFromImportURL,
  getSharedListNameFromUrl,
} from "../SharedListViewerIndexPage/actions/";
const ImportSharedListIndexPage = () => {
  const navigate = useNavigate();
  // Component State
  const [inputURL, setInputURL] = useState("");
  const [isImporting, setImporting] = useState(false);

  const handleOk = () => {
    setImporting(true);
    const sharedListId = getSharedListIdFromImportURL(inputURL);
    if (isNaN(sharedListId)) {
      message.error("Please enter valid URL");
      setImporting(false);
      return;
    }
    const sharedListName = getSharedListNameFromUrl(inputURL);
    fetchSharedListData(sharedListId).then((incomingData) => {
      if (incomingData !== null) {
        redirectToSharedListViewer(navigate, sharedListId, sharedListName);
      } else {
        message.error("Shared List does not exist");
        setImporting(false);
      }
    });
  };
  return (
    <>
      <Card title="Import Shared List From URL" bordered={false}>
        <Row justify="center">
          <Col span={24} style={{ textAlign: "center" }}>
            Please paste the URL of SharedList you want to import.
          </Col>
        </Row>
        <br />
        <Row justify="center">
          <Col span={16}>
            <Input
              placeholder="https://requestly.local:5577/shared-lists/viewer/12345678-AB-CB"
              prefix={<GlobalOutlined className="site-form-item-icon" />}
              value={inputURL}
              onChange={(e) => setInputURL(e.target.value)}
            />
          </Col>
          &nbsp;&nbsp;
          <Col>
            <Button
              type="primary"
              onClick={handleOk}
              key={"one"}
              loading={isImporting}
              icon={<ImportOutlined />}
              disabled={!isValidRQUrl(inputURL)}
            >
              Import Rules from this List
            </Button>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default ImportSharedListIndexPage;
