export interface CopyOption {
    paths: string[];
    /**
     * 当目标存在时是否覆盖
     */
    isForce?: boolean;
}