// ==UserScript==
// @name            Twitch Viewer Alerter
// @namespace       https://github.com/aranciro/
// @version         0.3.0
// @license         GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @description     Configurable browser userscript that alerts when selected users join the chat.
// @author          aranciro
// @homepage        https://github.com/aranciro/Twitch-Viewer-Alerter
// @supportURL      https://github.com/aranciro/Twitch-Viewer-Alerter/issues
// @updateURL       https://raw.githubusercontent.com/aranciro/Twitch-Viewer-Alerter/master/twitch-viewer-alerter.user.js
// @downloadURL     https://raw.githubusercontent.com/aranciro/Twitch-Viewer-Alerter/master/twitch-viewer-alerter.user.js
// @icon            https://github.com/aranciro/Twitch-Viewer-Alerter/raw/master/res/twitch-viewer-alerter-icon32.png
// @icon64          https://github.com/aranciro/Twitch-Viewer-Alerter/raw/master/res/twitch-viewer-alerter-icon64.png
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.min.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @grant           GM_addStyle
// @include         *://*.twitch.tv/*
// @run-at          document-idle
// ==/UserScript==

let mock = false;
let mockRequests = true;

const mockedPollingInterval = 7;
const mockedUpdateAnimationTimeout = 5;

const updateAnimationClassName = "tva-blink";
const viewerAlerterDivClassName = "tva-div";
const viewerAlerterDivIdPrefix = "viewerAlerter";

const selectors = {
  usernameAnchorNode: "div.channel-info-content a[href^='/']",
  usernameNode: "div.channel-info-content a[href^='/'] > h1.tw-title",
  divBelowChatInputNode: "div.sc-AxjAm.leQzso.chat-input__buttons-container",
  viewerAlerterDivNodes: `div[id^="${viewerAlerterDivIdPrefix}-"`,
};

GM_addStyle(`
@keyframes blinker { 50% { opacity: 0; } } 
.${updateAnimationClassName} { animation: blinker 1s linear infinite; }
.${viewerAlerterDivClassName} {
  display: flex !important;
  -webkit-box-pack: justify !important;
  justify-content: space-between !important;
  margin-top: 0.3rem !important;
}
`);

GM_registerMenuCommand("Configure Twitch Viewer Alerter", () => {
  GM_config.open();
});

const currentChannel = {
  name: undefined,
  nameShown: undefined,
};

const defaultCategoryColor = "#d8d8d8";

const channelCategories = {
  0: { name: "Big streamers", color: "#aa75ff" },
  1: { name: "Regular users", color: defaultCategoryColor },
  2: { name: "Annoying users", color: "#ff2323" },
};

let mockedResponseIndex = 0;
let mockedResponses = [
  [
    {
      data: {
        channel: {
          id: "56512296",
          chatters: {
            broadcasters: [
              {
                login: "n0l4nTwitch",
                __typename: "Chatter",
              },
            ],
            staff: [],
            moderators: [
              {
                login: "Yotobi",
                __typename: "Chatter",
              },
            ],
            vips: [
              {
                login: "LiquidShinozaki",
                __typename: "Chatter",
              },
            ],
            viewers: [
              {
                login: "gomboni",
                __typename: "Chatter",
              },
              {
                login: "atypicalpanic",
                __typename: "Chatter",
              },
              {
                login: "Zyxhac",
                __typename: "Chatter",
              },
              {
                login: "aranciro",
                __typename: "Chatter",
              },
              {
                login: "kennatwitch",
                __typename: "Chatter",
              },
            ],
            count: 76,
            __typename: "ChattersInfo",
          },
          __typename: "Channel",
        },
      },
      extensions: {
        durationMilliseconds: 22,
        operationName: "ChatViewers",
        requestID: "01F7487RNEC6JE98RV1WJDBWYR",
      },
    },
  ],
  [
    {
      data: {
        channel: {
          id: "56512296",
          chatters: {
            broadcasters: [
              {
                login: "n0l4nTwitch",
                __typename: "Chatter",
              },
            ],
            staff: [],
            moderators: [],
            vips: [
              {
                login: "LiquidShinozaki",
                __typename: "Chatter",
              },
            ],
            viewers: [
              {
                login: "atypicalpanic",
                __typename: "Chatter",
              },
              {
                login: "Zyxhac",
                __typename: "Chatter",
              },
              {
                login: "aranciro",
                __typename: "Chatter",
              },
              {
                login: "kennatwitch",
                __typename: "Chatter",
              },
            ],
            count: 76,
            __typename: "ChattersInfo",
          },
          __typename: "Channel",
        },
      },
      extensions: {
        durationMilliseconds: 22,
        operationName: "ChatViewers",
        requestID: "01F7487RNEC6JE98RV1WJDBWYR",
      },
    },
  ],
  [
    {
      data: {
        channel: {
          id: "56512296",
          chatters: {
            broadcasters: [
              {
                login: "n0l4nTwitch",
                __typename: "Chatter",
              },
            ],
            staff: [],
            moderators: [
              {
                login: "Yotobi",
                __typename: "Chatter",
              },
            ],
            vips: [
              {
                login: "LiquidShinozaki",
                __typename: "Chatter",
              },
            ],
            viewers: [
              {
                login: "gomboni",
                __typename: "Chatter",
              },
              {
                login: "aranciro",
                __typename: "Chatter",
              },
              {
                login: "kennatwitch",
                __typename: "Chatter",
              },
            ],
            count: 76,
            __typename: "ChattersInfo",
          },
          __typename: "Channel",
        },
      },
      extensions: {
        durationMilliseconds: 22,
        operationName: "ChatViewers",
        requestID: "01F7487RNEC6JE98RV1WJDBWYR",
      },
    },
  ],
  [
    {
      data: {
        channel: {
          id: "56512296",
          chatters: {
            broadcasters: [
              {
                login: "n0l4nTwitch",
                __typename: "Chatter",
              },
            ],
            staff: [],
            moderators: [
              {
                login: "Yotobi",
                __typename: "Chatter",
              },
            ],
            vips: [
              {
                login: "LiquidShinozaki",
                __typename: "Chatter",
              },
            ],
            viewers: [
              {
                login: "gomboni",
                __typename: "Chatter",
              },
              {
                login: "atypicalpanic",
                __typename: "Chatter",
              },
              {
                login: "Zyxhac",
                __typename: "Chatter",
              },
            ],
            count: 76,
            __typename: "ChattersInfo",
          },
          __typename: "Channel",
        },
      },
      extensions: {
        durationMilliseconds: 22,
        operationName: "ChatViewers",
        requestID: "01F7487RNEC6JE98RV1WJDBWYR",
      },
    },
  ],
  [
    {
      data: {
        channel: {
          id: "56512296",
          chatters: {
            broadcasters: [
              {
                login: "n0l4nTwitch",
                __typename: "Chatter",
              },
            ],
            staff: [],
            moderators: [],
            vips: [
              {
                login: "LiquidShinozaki",
                __typename: "Chatter",
              },
            ],
            viewers: [],
            count: 76,
            __typename: "ChattersInfo",
          },
          __typename: "Channel",
        },
      },
      extensions: {
        durationMilliseconds: 22,
        operationName: "ChatViewers",
        requestID: "01F7487RNEC6JE98RV1WJDBWYR",
      },
    },
  ],
  [
    {
      data: {
        channel: {
          id: "56512296",
          chatters: {
            broadcasters: [
              {
                login: "n0l4nTwitch",
                __typename: "Chatter",
              },
            ],
            staff: [],
            moderators: [
              {
                login: "Yotobi",
                __typename: "Chatter",
              },
            ],
            vips: [
              {
                login: "LiquidShinozaki",
                __typename: "Chatter",
              },
            ],
            viewers: [
              {
                login: "gomboni",
                __typename: "Chatter",
              },
              {
                login: "atypicalpanic",
                __typename: "Chatter",
              },
              {
                login: "Zyxhac",
                __typename: "Chatter",
              },
              {
                login: "aranciro",
                __typename: "Chatter",
              },
              {
                login: "kennatwitch",
                __typename: "Chatter",
              },
            ],
            count: 76,
            __typename: "ChattersInfo",
          },
          __typename: "Channel",
        },
      },
      extensions: {
        durationMilliseconds: 22,
        operationName: "ChatViewers",
        requestID: "01F7487RNEC6JE98RV1WJDBWYR",
      },
    },
  ],
];

const mockedMonitoredUsers = [
  {
    username: "aranciro",
    userCategory: 0,
  },
  {
    username: "Yotobi",
    userCategory: 0,
  },
  {
    username: "gomboni",
    userCategory: 1,
  },
  {
    username: "thewolfofficial_yt",
    userCategory: 2,
  },
  {
    username: "kennatwitch",
    userCategory: 1,
  },
  {
    username: "atypicalpanic",
    userCategory: 2,
  },
  {
    username: "Norisawa",
    userCategory: 1,
  },
  {
    username: "ValenTech",
    userCategory: 1,
  },
  {
    username: "Zyxhac",
    userCategory: 2,
  },
];

GM_config.init({
  id: "Twitch_Viewer_Alerter_config",
  title: "Twitch Viewer Alerter - Configuration",
  fields: {
    pollingInterval: {
      label:
        "<br /><br />Polling interval <br />(do not set too low or Twitch might label requests as spam and block them):<br />",
      title: "Insert the polling interval in seconds.",
      type: "int",
      min: 1,
      default: mock ? 7 : 30,
    },
    updateAnimationTimeout: {
      label:
        "<br /><br />Timeout before the blink animation disappears after an update:<br />",
      title: "Insert the timeout for the update blink animation.",
      type: "int",
      min: 0,
      default: 3,
    },
    monitoredUsers: {
      label:
        "<br /><br />Insert the users to be monitored, separated by comma (e.g. user1, user2,...). " +
        '\n<br />To add category append ":[category index]" (e.g. user1:2, user2:0,...). ' +
        "\n<br />Available categories: " +
        "\n<br />0 - Big streamers " +
        "\n<br />1 - Regular users (default)" +
        "\n<br />2 - Annoying users",
      title: "Insert the users to be monitored",
      type: "text",
      size: 30000,
      default: "",
    },
  },
  events: {
    save: () => {
      updateConfig();
    },
  },
});

GM_registerMenuCommand("Configure Twitch Viewer Alerter", () => {
  GM_config.open();
});

const getMonitoredUsersFromConfig = (monitoredUsersRawString) => {
  const defaultCategory = 1;
  let monitoredUsers = [];
  try {
    monitoredUsersRawString.split(",").forEach((monitoredUserInRawString) => {
      const monitoredUser = monitoredUserInRawString.trim().split(":");
      const username = monitoredUser[0].trim();
      const userCategory =
        monitoredUser.length > 1
          ? parseInt(monitoredUser[1].trim())
          : defaultCategory;
      monitoredUsers = [
        ...monitoredUsers,
        {
          username: username,
          userCategory: userCategory,
        },
      ];
    });
  } catch (e) {
    console.error(
      "Error while trying to obtain monitored users from config.",
      e
    );
    return [];
  }
  return monitoredUsers;
};

const config = mock
  ? {
      pollingInterval: mockedPollingInterval,
      updateAnimationTimeout: mockedUpdateAnimationTimeout,
      monitoredUsers: mockedMonitoredUsers,
    }
  : {
      pollingInterval: GM_config.get("pollingInterval"),
      updateAnimationTimeout: GM_config.get("updateAnimationTimeout"),
      monitoredUsers: getMonitoredUsersFromConfig(
        GM_config.get("monitoredUsers")
      ),
    };

const updateConfig = () => {
  config.pollingInterval = GM_config.get("pollingInterval");
  config.updateAnimationTimeout = GM_config.get("updateAnimationTimeout");
  config.monitoredUsers = getMonitoredUsersFromConfig(
    GM_config.get("monitoredUsers")
  );
  removeExistingViewerAlerterDivNodes();
  insertViewerAlerterFullNodes();
};

let monitoredUsersInChannel = [];
let fullViewerAlerterDivNodes = [];

const run = () => {
  const usernameNode = document.querySelector(selectors.usernameNode);
  const divBelowChatInputNode = document.querySelector(
    selectors.divBelowChatInputNode
  );
  if (
    usernameNode &&
    divBelowChatInputNode &&
    config.monitoredUsers.length > 0
  ) {
    console.log("Channel page found.");
    const usernameAnchorNode = document.querySelector(
      selectors.usernameAnchorNode
    );
    if (usernameAnchorNode) {
      const anchorHref = usernameAnchorNode.getAttribute("href");
      if (anchorHref && anchorHref.length > 1) {
        const usernameFromAnchor = anchorHref.substr(1);
        if (currentChannel.name !== usernameFromAnchor) {
          currentChannel.nameShown = usernameNode.innerText;
          currentChannel.name = usernameFromAnchor;
        }
        getChatters()
          .then((response) => handleChattersAPIResponse(response))
          .catch((error) => {
            console.error(error);
          });
      }
    }
  } else {
    console.log(
      "Not in a channel page or no monitored channels (" +
        config.monitoredUsers.length +
        " to be monitored)."
    );
  }
};

const createViewerAlerterH2Node = (categoryKey) => {
  const newViewerAlerterH2Node = document.createElement("h2");
  newViewerAlerterH2Node.setAttribute(
    "id",
    `${viewerAlerterDivIdPrefix}-${categoryKey}-text`
  );
  newViewerAlerterH2Node.classList.add("tw-font-size-7");
  newViewerAlerterH2Node.style.margin = "auto";
  newViewerAlerterH2Node.style.color = channelCategories[categoryKey].color;
  return newViewerAlerterH2Node;
};

const createViewerAlerterDivNode = (categoryKey) => {
  const newViewerAlerterDivNode = document.createElement("div");
  newViewerAlerterDivNode.setAttribute(
    "id",
    `${viewerAlerterDivIdPrefix}-${categoryKey}`
  );
  newViewerAlerterDivNode.setAttribute("name", viewerAlerterDivIdPrefix);
  newViewerAlerterDivNode.classList.add(
    "sc-AxjAm",
    `${viewerAlerterDivClassName}`,
    "chat-input__buttons-container"
  );
  newViewerAlerterDivNode.style.display = "none !important";
  newViewerAlerterDivNode.style.marginTop = "0.3em";
  newViewerAlerterDivNode.style.maxHeight = "4.3em";
  newViewerAlerterDivNode.style.overflow = "auto";
  return newViewerAlerterDivNode;
};

const getChatters = async () => {
  if (mockRequests) {
    const mockedResponseBody =
      mockedResponses[
        mockedResponseIndex > mockedResponses.length - 1
          ? mockedResponses.length - 1
          : mockedResponseIndex
      ];
    mockedResponseIndex++;
    return mockedResponseBody;
  }
  console.log("calling ChatViewers API");
  const url = "https://gql.twitch.tv/gql";
  const requestBody = JSON.stringify([
    {
      operationName: "ChatViewers",
      variables: {
        channelLogin: currentChannel.name,
      },
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash:
            "e0761ef5444ee3acccee5cfc5b834cbfd7dc220133aa5fbefe1b66120f506250",
        },
      },
    },
  ]);
  const chatViewersResponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "Client-Id": "kimne78kx3ncx6brgo4mv6wki5h1ko",
    },
    body: requestBody,
  });
  if (chatViewersResponse.ok) {
    let chatViewersResponseBody = await chatViewersResponse.json();
    return chatViewersResponseBody;
  } else {
    console.error(chatViewersResponse);
    const errorMessage = `Endpoint responded with status: ${chatViewersResponse.status}`;
    throw new Error(errorMessage);
  }
};

// TODO: validate with Joi instead
const responseIsValid = (response) => {
  return (
    Array.isArray(response) &&
    response.length > 0 &&
    "data" in response[0] &&
    "channel" in response[0].data &&
    "chatters" in response[0].data.channel &&
    "staff" in response[0].data.channel.chatters &&
    Array.isArray(response[0].data.channel.chatters.staff) &&
    (response[0].data.channel.chatters.staff.length == 0 ||
      ("login" in response[0].data.channel.chatters.staff[0] &&
        response[0].data.channel.chatters.staff[0].login != null &&
        response[0].data.channel.chatters.staff[0].login != undefined &&
        response[0].data.channel.chatters.staff[0].login.length > 0)) &&
    "moderators" in response[0].data.channel.chatters &&
    Array.isArray(response[0].data.channel.chatters.moderators) &&
    (response[0].data.channel.chatters.moderators.length == 0 ||
      ("login" in response[0].data.channel.chatters.moderators[0] &&
        response[0].data.channel.chatters.moderators[0].login != null &&
        response[0].data.channel.chatters.moderators[0].login != undefined &&
        response[0].data.channel.chatters.moderators[0].login.length > 0)) &&
    "vips" in response[0].data.channel.chatters &&
    Array.isArray(response[0].data.channel.chatters.vips) &&
    (response[0].data.channel.chatters.vips.length == 0 ||
      ("login" in response[0].data.channel.chatters.vips[0] &&
        response[0].data.channel.chatters.vips[0].login != null &&
        response[0].data.channel.chatters.vips[0].login != undefined &&
        response[0].data.channel.chatters.vips[0].login.length > 0)) &&
    "viewers" in response[0].data.channel.chatters &&
    Array.isArray(response[0].data.channel.chatters.viewers) &&
    (response[0].data.channel.chatters.viewers.length == 0 ||
      ("login" in response[0].data.channel.chatters.viewers[0] &&
        response[0].data.channel.chatters.viewers[0].login != null &&
        response[0].data.channel.chatters.viewers[0].login != undefined &&
        response[0].data.channel.chatters.viewers[0].login.length > 0))
  );
};

const handleMonitoredUsersInChannelChanged = (monitoredUsersFound) => {
  console.log("Monitored users in channel have changed");
  monitoredUsersInChannel = [...monitoredUsersFound];
  console.log("Found monitored users in channel");
  fullViewerAlerterDivNodes = [];
  Object.keys(channelCategories)
    .reverse()
    .forEach((categoryKey) => {
      const monitoredUsersInChannelForCategory = monitoredUsersInChannel.filter(
        (monitoredUserInChannel) =>
          monitoredUserInChannel.userCategory === parseInt(categoryKey)
      );
      if (monitoredUsersInChannelForCategory.length > 0) {
        let usersForCategoryH2String = monitoredUsersInChannelForCategory
          .map(({ username }) => username)
          .join(", ");
        const newViewerAlerterDivNode = createViewerAlerterDivNode(categoryKey);
        const newViewerAlerterH2Node = createViewerAlerterH2Node(categoryKey);
        const newViewerAlerterTextNode = document.createTextNode(
          usersForCategoryH2String
        );
        newViewerAlerterH2Node.appendChild(newViewerAlerterTextNode);
        newViewerAlerterDivNode.appendChild(newViewerAlerterH2Node);
        fullViewerAlerterDivNodes = [
          ...fullViewerAlerterDivNodes,
          newViewerAlerterDivNode,
        ];
      }
    });
  removeExistingViewerAlerterDivNodes();
  insertViewerAlerterFullNodes();
};

const getMonitoredUsersFromChatters = (chatters) => {
  let monitoredUsersFound = [];
  chatters.forEach((chatter) => {
    config.monitoredUsers.forEach((monitoredUser) => {
      if (
        monitoredUser.username.trim().toLowerCase() ===
        chatter.login.toLowerCase()
      ) {
        console.log("FOUND MONITORED USER! - " + monitoredUser.username);
        monitoredUsersFound = [...monitoredUsersFound, monitoredUser];
      }
    });
  });
  return monitoredUsersFound;
};

const handleChattersAPIResponse = (response) => {
  if (!responseIsValid(response)) {
    console.error(response);
    const errorMessage = "Invalid response body";
    throw new Error(errorMessage);
  }
  const { staff, moderators, vips, viewers } =
    response[0].data.channel.chatters;
  const chatters = [...staff, ...moderators, ...vips, ...viewers];
  let monitoredUsersFound = getMonitoredUsersFromChatters(chatters);
  console.log(
    "🚀 ~ file: twitch-viewer-alerter.user.js ~ line 195 ~ handleChattersAPIResponse ~ chattersFound",
    monitoredUsersFound
  );
  console.log(
    "🚀 ~ file: twitch-viewer-alerter.user.js ~ line 208 ~ handleChattersAPIResponse ~ channelsPresent",
    monitoredUsersInChannel
  );
  const monitoredUsersInChannelChanged = !arraysEqual(
    monitoredUsersFound,
    monitoredUsersInChannel
  );
  if (monitoredUsersInChannelChanged) {
    handleMonitoredUsersInChannelChanged(monitoredUsersFound);
  } else {
    console.log("No new monitored channels found compared to before.");
  }
};

const removeExistingViewerAlerterDivNodes = () => {
  const viewerAlerterDivNodes = document.querySelectorAll(
    `div[id^="${viewerAlerterDivIdPrefix}-"`
  );
  viewerAlerterDivNodes.forEach((viewerAlerterDivNode) => {
    viewerAlerterDivNode.remove();
  });
};

const insertViewerAlerterFullNodes = () => {
  const divBelowChatInputNode = document.querySelector(
    selectors.divBelowChatInputNode
  );
  if (divBelowChatInputNode) {
    fullViewerAlerterDivNodes.forEach((fullViewerAlerterDivNode) => {
      divBelowChatInputNode.parentNode.insertBefore(
        fullViewerAlerterDivNode,
        divBelowChatInputNode.nextSibling
      );
    });
    const insertedViewerAlerterDivNodes = document.querySelectorAll(
      selectors.viewerAlerterDivNodes
    );
    insertedViewerAlerterDivNodes.forEach((insertedViewerAlerterDivNode) => {
      insertedViewerAlerterDivNode.classList.add(`${updateAnimationClassName}`);
    });
    setUpdateAnimationTimeout(insertedViewerAlerterDivNodes);
  }
};

const setUpdateAnimationTimeout = (insertedViewerAlerterDivNodes) => {
  setTimeout(() => {
    insertedViewerAlerterDivNodes.forEach((insertedViewerAlerterDivNode) => {
      insertedViewerAlerterDivNode.classList.remove(
        `${updateAnimationClassName}`
      );
    });
  }, config.updateAnimationTimeout * 1000);
};

const arraysEqual = (a1, a2) =>
  a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));

const objectsEqual = (o1, o2) =>
  typeof o1 === "object" && Object.keys(o1).length > 0
    ? Object.keys(o1).length === Object.keys(o2).length &&
      Object.keys(o1).every((p) => objectsEqual(o1[p], o2[p]))
    : o1 === o2;

(() => {
  console.log("Twitch Viewer Alerter userscript - START");
  try {
    run();
    setInterval(() => run(), config.pollingInterval * 1000);
  } catch (e) {
    console.log("Twitch Viewer Alerter userscript - STOP (ERROR) \n", e);
  }
})();
