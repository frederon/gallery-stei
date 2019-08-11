"use strict";

require("greenlock-express")
  .create({
    version: "draft-11",

    server: "https://acme-v02.api.letsencrypt.org/directory",
    // Note: If at first you don't succeed, stop and switch to staging
    // https://acme-staging-v02.api.letsencrypt.org/directory

    // You MUST change this to a valid email address
    email: "frederic.ronaldi@gmail.com",

    // You MUST NOT build clients that accept the ToS without asking the user
    agreeTos: true,

    // You MUST change these to valid domains
    // NOTE: all domains will validated and listed on the certificate
    approvedDomains: ["stei.regis.studio", "www.stei.regis.studio"],

    // You MUST have access to write to directory where certs are saved
    // ex: /home/foouser/acme/etc
    configDir: "~/.config/acme/",

    // Get notified of important updates and help me make greenlock better
    communityMember: false,

    app: require("../app")

    //, debug: true
  })
  .listen(80, 443);
