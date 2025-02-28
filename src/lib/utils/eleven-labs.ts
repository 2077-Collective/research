import { PUBLIC_ELEVEN_LABS_KEY } from '$env/static/public';
import { ElevenLabsClient } from 'elevenlabs';

export const elevenLabsClient = new ElevenLabsClient({ apiKey: PUBLIC_ELEVEN_LABS_KEY });

export const createAudioStreamFromText = async (text: string): Promise<Buffer> => {
	const audioStream = await elevenLabsClient.textToSpeech.convertAsStream('JBFqnCBsd6RMkjVDRZzb', {
		model_id: 'eleven_multilingual_v2',
		text,
		output_format: 'mp3_44100_128',
		// Optional voice settings that allow you to customize the output
		voice_settings: {
			stability: 0,
			similarity_boost: 1.0,
			use_speaker_boost: true,
			speed: 1.0
		}
	});
	const chunks: Buffer[] = [];
	for await (const chunk of audioStream) {
		chunks.push(chunk);
	}
	const content = Buffer.concat(chunks);
	return content;
};
