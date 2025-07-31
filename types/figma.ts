type FrameInfo = {
    nodeId: string;
    name: string;
    pageId: string;
    pageName: string;
};

export type FigmaComponent = {
    key: string;
    file_key: string;
    node_id: string;
    thumbnail_url: string;
    name: string;
    description: string;
    updated_at: string;
    created_at: string;
    containing_frame: FrameInfo;
};

export type FigmaResponse = {
    status: number;
    error: boolean;
    meta: {
        components?: FigmaComponent[];
        component_sets?: FigmaComponent[];
    };
};

export type FigmaMeta = {
    name: string;
    description: string;
};

export type MetaCollection = Map<string, FigmaMeta>;

export type MetaPages = Map<string, MetaCollection>;

export type MetaCollections = {
    components?: MetaPages;
    component_sets?: MetaPages;
};
