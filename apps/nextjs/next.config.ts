import type {NextConfig} from "next";

const common: NextConfig = {
    productionBrowserSourceMaps: true,
    experimental: {
        serverActions: {
            bodySizeLimit: "100mb"
        }
    },
    images: {
        domains: ["storage.googleapis.com"]
    }
};

const devConfig: NextConfig = {
    ...common,

    turbopack: {
        rules: {
            "*.svg": {
                loaders: ["@svgr/webpack"],
                as: "*.js"
            }
        }
    }
};

const prodConfig: NextConfig = {
    ...common,
    compiler: {
        ...common.compiler,
        removeConsole: true
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack", "url-loader"]
        });

        return config;
    }
};

export default process.env.NODE_ENV === "development" ? devConfig : prodConfig;
