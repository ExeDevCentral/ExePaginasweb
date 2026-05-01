interface DeployOptions {
    domain?: string;
    prod?: boolean;
}
export declare function deploy(platform: string, options: DeployOptions): Promise<void>;
export declare function quickDeploy(platform?: string): Promise<void>;
export {};
//# sourceMappingURL=deploy.d.ts.map