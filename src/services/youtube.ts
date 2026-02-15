import axios from 'axios';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

export interface YoutubeVideoDetails {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    chapters: YoutubeChapter[];
}

export interface YoutubeChapter {
    title: string;
    timestamp: string;
    order: number;
}

export async function fetchVideoDetails(videoId: string): Promise<YoutubeVideoDetails> {
    const response = await axios.get(`${YOUTUBE_API_URL}/videos`, {
        params: {
            part: 'snippet',
            id: videoId,
            key: YOUTUBE_API_KEY,
        },
    });

    if (!response.data.items?.length) {
        throw new Error('Video not found');
    }

    const { title, description, thumbnails } = response.data.items[0].snippet;
    const chapters = parseChapters(description);

    return {
        id: videoId,
        title,
        description,
        thumbnailUrl: thumbnails.high?.url || thumbnails.default?.url,
        chapters,
    };
}

function parseChapters(description: string): YoutubeChapter[] {
    const chapters: YoutubeChapter[] = [];
    // Regex to match timestamps like 00:00, 0:00, 1:00:00 followed by text
    const timestampRegex = /^(\d{1,2}:)?(\d{1,2}:)?\d{2}\s+(.*)$/mg;

    let match;
    let order = 0;
    while ((match = timestampRegex.exec(description)) !== null) {
        const fullLine = match[0];
        const timestampPart = fullLine.split(/\s+/)[0];
        const titlePart = fullLine.substring(timestampPart.length).trim();

        chapters.push({
            title: titlePart,
            timestamp: timestampPart,
            order: order++,
        });
    }

    return chapters;
}
