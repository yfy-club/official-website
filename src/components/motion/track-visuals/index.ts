"use client";

import type { ComponentType } from "react";

import { AiAttentionVisual, AiDetectionVisual, AiMlpVisual } from "./ai";
import { IotEdgeVisual, IotMqttVisual, IotTsdbVisual } from "./cloud-iot";
import { DbBTreeVisual, DbMvccVisual, DbWalVisual } from "./database";
import { IndCalibVisual, IndOpcuaVisual, IndVisionVisual } from "./industrial";
import { SwAgentVisual, SwCacheVisual, SwSnowflakeVisual } from "./software";

/**
 * 概念 code → 可视化组件。
 * 图与概念一一绑定：换概念就换图，不存在「一张装饰图配三张卡」的错位。
 * 新增概念时若未登记，章节会优雅降级为纯文字规格，不会崩。
 */
export const CONCEPT_VISUALS: Record<string, ComponentType> = {
  AI_NN_01: AiMlpVisual,
  AI_ATTN_02: AiAttentionVisual,
  AI_CV_03: AiDetectionVisual,

  SW_DIST_01: SwSnowflakeVisual,
  SW_CACHE_02: SwCacheVisual,
  SW_AGENT_03: SwAgentVisual,

  DB_BTREE_01: DbBTreeVisual,
  DB_MVCC_02: DbMvccVisual,
  DB_WAL_03: DbWalVisual,

  IOT_MQTT_01: IotMqttVisual,
  IOT_EDGE_02: IotEdgeVisual,
  IOT_TSDB_03: IotTsdbVisual,

  IND_CALIB_01: IndCalibVisual,
  IND_OPC_02: IndOpcuaVisual,
  IND_VISION_03: IndVisionVisual,
};
