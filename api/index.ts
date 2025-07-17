import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { Hono } from "hono";
import { handle } from "hono/vercel";
import { DEPLOYMENT_URL } from "vercel-url";
import { paymentMiddleware } from "x402-hono";

const ACCOUNT_ID = process.env.ACCOUNT_ID;
const AGENT_URL = process.env.BITTE_AGENT_URL || DEPLOYMENT_URL;
const WALLET_ADDRESS = process.env.WALLET_ADDRESS as `0x${string}` || "0xbd6a34374441f3c4194039ce710935d7c50cc3b1";
const FACILITATOR_URL = process.env.FACILITATOR_URL as `${string}://${string}` || "https://x402.org/facilitator";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicPath = (file: string) => join(__dirname, '..', 'public', file);


const readFile = (file: string) => readFileSync(publicPath(file));
const readFileWithEncoding = (file: string, encoding: BufferEncoding) => readFileSync(publicPath(file), encoding);

const app = new Hono();

app.use(paymentMiddleware(
  WALLET_ADDRESS,
  {
    "/premium-insights": {
      price: "$0.01",
      network: "base-sepolia",
      config: {
        description: "Access to premium AI insights and analysis",
        mimeType: "application/json",
        maxTimeoutSeconds: 120
      }
    },
    "/advanced-query": {
      price: "$0.05",
      network: "base-sepolia",
      config: {
        description: "Advanced Bitte protocol query with detailed analytics",
        mimeType: "application/json"
      }
    }
  },
  {
    url: FACILITATOR_URL,
  }
));

app.get("/favicon.ico", () => new Response(readFile("favicon.ico"), {
  headers: { "Content-Type": "image/x-icon" }
}));

app.get("/logo.png", () => new Response(readFile("logo.png"), {
  headers: { "Content-Type": "image/png" }
}));

app.get("/", (c) => c.html(readFileWithEncoding("page.html", "utf-8")));

// Monetized routes - these require payment to access
app.get("/premium-insights", (c) => {
  return c.json({
    success: true,
    data: {
      insights: [
        {
          topic: "Bitte Protocol Adoption",
          analysis: "Advanced analytics showing 312% growth in agent deployments",
          confidence: 0.94,
          trending_keywords: ["AI agents", "autonomous payments", "crypto micropayments"]
        },
        {
          topic: "Market Opportunities",
          analysis: "Identified 15 high-value integration opportunities for developers",
          confidence: 0.88,
          potential_revenue: "$125,000 estimated monthly"
        }
      ],
      premium_metrics: {
        agent_performance_score: 8.7,
        market_sentiment: "bullish",
        recommendation: "Scale deployment immediately"
      }
    },
    timestamp: new Date().toISOString()
  });
});

app.get("/advanced-query", (c) => {
  return c.json({
    success: true,
    data: {
      query_result: "Advanced Bitte Protocol Analysis Complete",
      deep_insights: {
        protocol_health: "Excellent",
        network_activity: "High volume - 2.3M transactions today",
        developer_adoption: "Growing 45% month-over-month",
        ai_agent_integrations: 1247
      },
      detailed_analytics: {
        gas_optimization: "Average 32% reduction using Bitte patterns",
        success_rate: "99.7% payment completion rate",
        average_response_time: "147ms",
        geographic_distribution: {
          "North America": "42%",
          "Europe": "31%",
          "Asia": "27%"
        }
      },
      recommendations: [
        "Implement batch payment processing for 15% fee reduction",
        "Consider expanding to Polygon network for lower fees",
        "Optimize agent response patterns for better UX"
      ]
    },
    timestamp: new Date().toISOString(),
    premium_data_version: "v2.1.0"
  });
});

app.get("/.well-known/ai-plugin.json", (c) => c.json({
  openapi: "3.0.0",
  info: {
    title: "Bitte Docs Agent",
    description: "Bitte Docs Agent Specification. https://docs.bitte.ai",
    version: "1.0.0",
  },
  servers: [{ url: AGENT_URL }],
  "x-mb": {
    "account-id": ACCOUNT_ID,
    assistant: {
      name: "Bitte Docs AI",
      description: "Bitte Protocol Knowledge Assistant. Ask anything about Bitte Protocol. https://docs.bitte.ai",
      instructions: `You are a helpful assistant that provides accurate information about Bitte protocol. You use the Bitte docs to answer questions, encouraging exploration, learning, and development with the Bitte protocol.  The Bitte docs are available at https://docs.bitte.ai.  Use the data-retrieval tool to fetch the most relevant information from the docs based on the user's query.  When responding, be concise, include links to relevant source material, and be adaptive to the user's domain knowledge.`,
      tools: [{ type: "data-retrieval" }],
      image: `${AGENT_URL}/logo.png`,
    },
  },
  paths: {
    "/premium-insights": {
      get: {
        operationId: "getPremiumInsights",
        summary: "Get premium AI insights and analysis",
        description: "Access premium insights about Bitte Protocol adoption, market opportunities, and performance metrics",
        responses: {
          "200": {
            description: "Premium insights data",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "object",
                      properties: {
                        insights: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              topic: { type: "string" },
                              analysis: { type: "string" },
                              confidence: { type: "number" },
                              trending_keywords: {
                                type: "array",
                                items: { type: "string" }
                              }
                            }
                          }
                        },
                        premium_metrics: {
                          type: "object",
                          properties: {
                            agent_performance_score: { type: "number" },
                            market_sentiment: { type: "string" },
                            recommendation: { type: "string" }
                          }
                        }
                      }
                    },
                    timestamp: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/advanced-query": {
      get: {
        operationId: "getAdvancedQuery",
        summary: "Advanced Bitte protocol analytics",
        description: "Get detailed analytics including protocol health, network activity, and developer adoption metrics",
        responses: {
          "200": {
            description: "Advanced analytics data",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "object",
                      properties: {
                        query_result: { type: "string" },
                        deep_insights: {
                          type: "object",
                          properties: {
                            protocol_health: { type: "string" },
                            network_activity: { type: "string" },
                            developer_adoption: { type: "string" },
                            ai_agent_integrations: { type: "number" }
                          }
                        },
                        detailed_analytics: {
                          type: "object",
                          properties: {
                            gas_optimization: { type: "string" },
                            success_rate: { type: "string" },
                            average_response_time: { type: "string" },
                            geographic_distribution: {
                              type: "object",
                              additionalProperties: { type: "string" }
                            }
                          }
                        },
                        recommendations: {
                          type: "array",
                          items: { type: "string" }
                        }
                      }
                    },
                    timestamp: { type: "string" },
                    premium_data_version: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
}));

const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const OPTIONS = handler;