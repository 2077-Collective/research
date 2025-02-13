import { z } from 'zod';

const TeamMemberSchema = z.object({
	full_name: z.string(),
	twitter_username: z.string().optional(),
	role: z.string(),
	picture_url: z.string().optional(),
	summary: z.string()
});

export type TeamMember = z.infer<typeof TeamMemberSchema>;
export { TeamMemberSchema };
