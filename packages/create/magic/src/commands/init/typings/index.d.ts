export interface MagicCliRcConfigItem {
    input: string;
    output: string;
    deleteSource: boolean;
}
export interface MagicCliRcConfig {
    files2copy: MagicCliRcConfigItem[];
    files2Render: MagicCliRcConfigItem[];
}
