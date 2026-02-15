//models
const Setting = require("../models/Setting");
const fs = require("fs");
const path = require("path");

//global setting controller
const addGlobalSetting = async (req, res) => {
  try {
    const newGlobalSetting = new Setting(req.body);
    await newGlobalSetting.save();
    res.send({
      message: "Global Setting Added Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getGlobalSetting = async (req, res) => {
  try {
    // console.log("getGlobalSetting");

    const globalSetting = await Setting.findOne({ name: "globalSetting" });

    if (!globalSetting) {
      return res.status(404).send({ message: "Global settings not found" });
    }

    res.send(globalSetting.setting);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateGlobalSetting = async (req, res) => {
  try {
    const { setting } = req.body;

    // Construct the $set object dynamically
    const setObject = Object.keys(setting).reduce((acc, key) => {
      acc[`setting.${key}`] = setting[key];
      return acc;
    }, {});

    const globalSetting = await Setting.findOneAndUpdate(
      { name: "globalSetting" },
      { $set: setObject },
      { new: true, upsert: true },
    );

    res.send({
      data: globalSetting,
      message: "Global Setting Update Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

//store setting controller
const addStoreSetting = async (req, res) => {
  try {
    const newStoreSetting = new Setting(req.body);
    await newStoreSetting.save();
    res.send({
      message: "Store Setting Added Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getStoreSetting = async (req, res) => {
  try {
    // console.log("getStoreSetting");

    const storeSetting = await Setting.findOne({ name: "storeSetting" });

    if (!storeSetting) {
      return res.status(404).send({ message: "Store settings not found" });
    }

    res.send(storeSetting.setting);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateStoreSetting = async (req, res) => {
  try {
    const { setting } = req.body;

    // Dynamically build the update fields
    const updateFields = Object.keys(setting).reduce((acc, key) => {
      acc[`setting.${key}`] = setting[key];
      return acc;
    }, {});
    // Update the online store setting document
    const storeSetting = await Setting.findOneAndUpdate(
      { name: "storeSetting" },
      { $set: updateFields },
      { new: true, upsert: true }, // upsert to create the document if it doesn't exist
    );

    res.send({
      data: storeSetting,
      message: "Store Setting Update Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

//online store customization controller
const addStoreCustomizationSetting = async (req, res) => {
  try {
    const newStoreCustomizationSetting = new Setting(req.body);
    const storeCustomizationSetting = await newStoreCustomizationSetting.save();

    res.send({
      data: storeCustomizationSetting,
      message: "Online Store Customization Setting Added Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getStoreCustomizationSetting = async (req, res) => {
  try {
    const { key, keyTwo } = req.query;
    // console.log("getStoreCustomizationSetting");

    // console.log("req query", req.query, "key", key, "keyTwo", keyTwo);

    let projection = {};
    if (key) {
      projection[`setting.${key}`] = 1;
    }
    if (keyTwo) {
      projection[`setting.${keyTwo}`] = 1;
    }

    // If neither key nor keyTwo is provided, fetch all settings
    if (!key && !keyTwo) {
      projection = { setting: 1 };
    }

    const storeCustomizationSetting = await Setting.findOne(
      { name: "storeCustomizationSetting" },
      projection,
    );

    if (!storeCustomizationSetting) {
      return res.status(404).send({ message: "Settings not found" });
    }

    res.send(storeCustomizationSetting.setting);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getStoreSeoSetting = async (req, res) => {
  // console.log("getStoreSeoSetting");
  try {
    const storeCustomizationSetting = await Setting.findOne(
      {
        name: "storeCustomizationSetting",
      },
      { "setting.seo": 1, _id: 0 },
    );
    // console.log("storeCustomizationSetting", storeCustomizationSetting);
    // Return the `seo` object directly so frontend can access fields like `favicon`.
    res.send(storeCustomizationSetting?.setting?.seo || {});
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateStoreCustomizationSetting = async (req, res) => {
  try {
    const { setting } = req.body;

    // Dynamically build the update fields
    const updateFields = Object.keys(setting).reduce((acc, key) => {
      acc[`setting.${key}`] = setting[key];
      return acc;
    }, {});
    // Update the online store setting document
    const storeCustomizationSetting = await Setting.findOneAndUpdate(
      { name: "storeCustomizationSetting" },
      { $set: updateFields },
      { new: true, upsert: true }, // upsert to create the document if it doesn't exist
    );

    res.send({
      data: storeCustomizationSetting,
      message: "Online Store Customization Setting Update Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Get Firebase configuration (public endpoint)
const getFirebaseConfig = async (req, res) => {
  try {
    const storeSetting = await Setting.findOne({ name: "storeSetting" });

    if (!storeSetting || !storeSetting.setting.firebase_status) {
      return res.status(404).send({
        message: "Firebase configuration not enabled or not found",
      });
    }

    // Return only Firebase config without sensitive fields
    res.send({
      enabled: storeSetting.setting.firebase_status,
      apiKey: storeSetting.setting.firebase_api_key,
      authDomain: storeSetting.setting.firebase_auth_domain,
      projectId: storeSetting.setting.firebase_project_id,
      storageBucket: storeSetting.setting.firebase_storage_bucket,
      messagingSenderId: storeSetting.setting.firebase_messaging_sender_id,
      appId: storeSetting.setting.firebase_app_id,
      measurementId: storeSetting.setting.firebase_measurement_id,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Get Cloudinary configuration (public endpoint)
const getCloudinaryConfig = async (req, res) => {
  try {
    const storeSetting = await Setting.findOne({ name: "storeSetting" });

    if (!storeSetting || !storeSetting.setting.cloudinary_status) {
      return res.status(404).send({
        message: "Cloudinary configuration not enabled or not found",
      });
    }

    // Return only public Cloudinary config (exclude API secret)
    res.send({
      enabled: storeSetting.setting.cloudinary_status,
      cloudName: storeSetting.setting.cloudinary_cloud_name,
      uploadPreset: storeSetting.setting.cloudinary_upload_preset,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Get Stallion configuration (for backend use)
const getStallionConfig = async (req, res) => {
  try {
    const storeSetting = await Setting.findOne({ name: "storeSetting" });

    if (!storeSetting || !storeSetting.setting.stallion_status) {
      return res.status(404).send({
        message: "Stallion configuration not enabled or not found",
      });
    }

    res.send({
      enabled: storeSetting.setting.stallion_status,
      apiKeySandbox: storeSetting.setting.stallion_api_key_sandbox,
      apiKeyProd: storeSetting.setting.stallion_api_key_prod,
      baseUrlSandbox:
        storeSetting.setting.stallion_base_url_sandbox ||
        "https://sandbox.stallionexpress.ca/api/v4/",
      baseUrlProd:
        storeSetting.setting.stallion_base_url_prod ||
        "https://ship.stallionexpress.ca/api/v4/",
      webhookSecret: storeSetting.setting.stallion_webhook_secret,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Generate XML Sitemap
const generateSitemap = async (req, res) => {
  try {
    const { urls } = req.body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).send({
        message: "Please provide an array of URLs",
      });
    }

    // Generate XML content
    const currentDate = new Date().toISOString();
    
    let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xmlContent += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    urls.forEach((url) => {
      if (url && url.trim()) {
        xmlContent += '  <url>\n';
        xmlContent += `    <loc>${url.trim()}</loc>\n`;
        xmlContent += `    <lastmod>${currentDate}</lastmod>\n`;
        xmlContent += '    <changefreq>weekly</changefreq>\n';
        xmlContent += '    <priority>0.8</priority>\n';
        xmlContent += '  </url>\n';
      }
    });
    
    xmlContent += '</urlset>';

    // Save the sitemap to public folder
    const publicDir = path.join(__dirname, "..", "public");
    
    // Create public directory if it doesn't exist
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const sitemapPath = path.join(publicDir, "sitemap.xml");
    fs.writeFileSync(sitemapPath, xmlContent, "utf8");

    // Determine store/front-end base URL from env (prefer store URL)
    let storeUrl =
      process.env.STORE_URL ||
      process.env.NEXT_PUBLIC_STORE_DOMAIN ||
      process.env.STORE_DOMAIN ||
      process.env.FRONTEND_URL ||
      process.env.CLIENT_URL;

    // If no env var provided, try to read the store URL from DB settings
    if (!storeUrl) {
      try {
        const storeSetting = await Setting.findOne({ name: "storeSetting" });
        const metaUrl = storeSetting?.setting?.meta_url || storeSetting?.setting?.store_url || storeSetting?.setting?.storeDomain;
        if (metaUrl) storeUrl = metaUrl;
      } catch (e) {
        // ignore DB lookup errors and fallback to API host
      }
    }

    // Fallback to API host if still no store URL provided
    let baseUrl = storeUrl || process.env.API_URL || req.protocol + "://" + req.get("host");

    // Normalize: remove trailing slash(es)
    if (baseUrl && baseUrl.endsWith("/")) {
      baseUrl = baseUrl.replace(/\/+$/g, "");
    }

    const sitemapUrl = `${baseUrl}/sitemap.xml`;

    res.send({
      message: "Sitemap generated successfully!",
      sitemapUrl: sitemapUrl,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  addGlobalSetting,
  getGlobalSetting,
  updateGlobalSetting,
  addStoreSetting,
  getStoreSetting,
  updateStoreSetting,
  getStoreSeoSetting,
  addStoreCustomizationSetting,
  getStoreCustomizationSetting,
  updateStoreCustomizationSetting,
  getFirebaseConfig,
  getCloudinaryConfig,
  getStallionConfig,
  generateSitemap,
};
