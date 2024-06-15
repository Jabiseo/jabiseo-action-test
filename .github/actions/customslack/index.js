const core = require("@actions/core");
const fetch = require("node-fetch");

function generatePayload({ text, channel, color, prTitle, author, repo, url }) {
  console.log("payload ==> ");
  console.log(JSON.stringify({ text, channel, color, prTitle, author, repo, url }));
  return {
    text,
    channel,
    attachments: [
      {
        color,
        blocks: [
          {
            type: "header",
            text: { type: "plain_text", text: prTitle, emoji: true },
          },
          {
            type: "divider",
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*PR 제목:*\n ${prTitle} `,
              },
              {
                type: "mrkdwn",
                text: `*요청자:*\n ${author}`,
              },
            ],
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*repo:*\n ${repo}`,
              },
            ],
          },
          {
            type: "actions",
            block_id: "submit_button_action_block",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "바로가기",
                },
                url: url,
                action_id: "button-action",
              },
            ],
          },
        ],
      },
    ],
  };
}

async function run() {
  const CHAT_POST_MESSAGE_URL = "https://slack.com/api/chat.postMessage";
  try {
    const prTitle = core.getInput("prTitle");
    const author = core.getInput("author");
    const statusColor = core.getInput("statusColor");
    const channelId = core.getInput("channelId");
    const repo = core.getInput("repo");
    const url = core.getInput("url");
    const slackToken = core.getInput("slackToken");
    const text = "GITHUB CI 결과";

    const payload = generatePayload({ text, channel: channelId, color: statusColor, prTitle, author, repo, url });

    const response = await fetch(CHAT_POST_MESSAGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${slackToken}` },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();
    console.log(responseData);
  } catch (error) {
    core.setFailed(`Action failed with error ${error}`);
  }
}

run();
