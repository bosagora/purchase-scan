import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import heightIcon from "assets/images/height.svg";
import transactionIcon from "assets/images/transaction.svg";
import circulate from "assets/images/circulate.svg";
import { ReactSVG } from "react-svg";
import { useTranslation, withTranslation } from "react-i18next";
import { searchDataUpdater } from "store/header/thunks";
import "moment/locale/ko";
import { getPretty } from "../../global/utils/CalcUtils";
import BlocksBox from "../../components/Dashboard/Blocks";
import TransactionBox from "../../components/Dashboard/TransactionBox";
import PageHelmet from "../../components/PageHelmet/PageHelmet";
import SearchBar from "../../components/SearchBar/SearchBar";
import { useByFromHeight, useLastHeight } from "../../hooks/useRollup";
import request from "../../global/api/request";
import { Block, Transaction } from "rollup-pm-sdk";
import { BlockHeader } from "../../global/Types";

const Dashboard: React.FC = () => {
  // states for current screen
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const searchedData = useSelector((state: any) => state.header.searchedData);

  const [blockLoading, setBlockLoading] = useState(false);
  const [transactionLoading, setTransactionLoading] = useState(false);

  const [blocksData, setBlocksData] = useState<any>([]);
  const [transactionsData, setTransactionsData] = useState<Transaction[]>([]);

  const [totalTransaction, setTotalTransaction] = useState<number>();
  const [blockHeader, setBlockHeader] = useState<BlockHeader>();
  const [blockTime, setBlockTime] = useState<number>();
  const { height, heightError } = useLastHeight();
  const { blocksHeader, blocksHeaderError } = useByFromHeight(height, 10);

  useEffect(() => {
    if (blockHeader && blockHeader?.CID) {
      request("GET", blockHeader.CID, {})
        .then((res) => {
          if (res.status === 200) {
            const block: Block = res.data as Block;
            if (block?.txs?.length) {
              const txs = block.txs;
              const lastTx: Transaction = txs[txs.length - 1];
              setTotalTransaction(lastTx?.sequence ?? Number.NaN);
              const txTen = txs
                .slice(txs.length > 10 ? -10 : txs.length * -1)
                .reverse();
              setTransactionsData(txTen);
            }
          }
        })
        .catch((e) => {
          console.log("e", e);
        });
    }
  }, [blockHeader?.height]);

  useEffect(() => {
    if (blocksHeader && blocksHeader.length > 0) {
      const reverse = blocksHeader.reverse();
      setBlockHeader(reverse[0]);
      setBlocksData(reverse);
      if (reverse.length >= 2) {
        const currentTime = reverse[0].timestamp;
        const prevTime = reverse[1].timestamp;
        setBlockTime(currentTime - prevTime);
      }
    }
  }, [blocksHeader]);

  useEffect(() => {
    setBlockLoading(false);
    setTransactionLoading(false);
  }, [dispatch]);

  useEffect(() => {}, [heightError, blocksHeaderError]);

  return (
    <div id="dashboard">
      <PageHelmet
        title={`The9 Rollup Explorer - Dashboard`}
        meta={{ name: "Dashboard", content: "Lorem Ipsum" }}
      />
      <div className="dashboard-top">
        <div className="bg" />
        <Container fluid="xl">
          <Row>
            <Col xl={12} lg={12}>
              <h1>{t("the_9_rollup_explorer")}</h1>
              <SearchBar
                searchedDataGet={(searchId: any) =>
                  dispatch(searchDataUpdater(searchId))
                }
                searchedData={searchedData}
              />
            </Col>
          </Row>
        </Container>
      </div>
      <div className="dashboard">
        <Container fluid="xl">
          <div className="d-lg">
            <div className="market-values">
              <Card>
                <div className="head">
                  <div className="title">
                    <ReactSVG src={heightIcon} />
                    <p>{t("Block_height")}</p>
                  </div>
                </div>
                <div className="values">
                  <h4>{Boolean(height) && getPretty(height)}</h4>
                  {/*<p>*/}
                  {/*  {getLatestHeightTime(stats?.time_stamp && stats.time_stamp)}*/}
                  {/*</p>*/}
                </div>
              </Card>
              <Card>
                <div className="head">
                  <div className="title">
                    <ReactSVG src={transactionIcon} />
                    <p>{t("Transactions")}</p>
                  </div>
                </div>
                <div className="values">
                  <h4>{totalTransaction && getPretty(totalTransaction)}</h4>
                  <p>{t("Total")}</p>
                </div>
              </Card>
              <Card>
                <div className="head">
                  <div className="title" style={{ cursor: "unset" }}>
                    <ReactSVG src={circulate} />
                    <p>{t("Block_Time")}</p>
                  </div>
                </div>
                <div className="values">
                  <h4>{blockTime && getPretty(blockTime)}</h4>
                  <p>sec</p>
                </div>
              </Card>
            </div>
          </div>
        </Container>
        <Container fluid="xl">
          <div className="bt-container">
            {/* Top Blocks section */}
            <BlocksBox data={blocksData} isLoading={blockLoading} />
            {/* Top Transactions section */}
            <TransactionBox
              data={transactionsData}
              isLoading={transactionLoading}
            />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default withTranslation()(Dashboard);