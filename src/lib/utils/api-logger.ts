// src/lib/utils/api-logger.ts
import { browser } from '$app/environment';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export const logApiResponse = async (
    response: any,
    context: string,
    transformedData?: any
) => {
    const timestamp = new Date().toISOString();
    const logData = {
        timestamp,
        context,
        rawResponse: response,
        transformedData: transformedData || null,
        metadata: {
            hasData: !!response?.data,
            dataLength: response?.data?.length,
            firstItem: response?.data?.[0] ? {
                id: response.data[0].id,
                hasAttributes: !!response.data[0].attributes,
                attributeKeys: response.data[0].attributes ? Object.keys(response.data[0].attributes) : []
            } : null
        }
    };

    // Convert to pretty JSON with proper indentation
    const logContent = JSON.stringify(logData, null, 2);

    try {
        if (browser) {
            // Client-side logging
            console.log(`API Response Log - ${context}:`, logData);
            
            // Create download in browser
            const blob = new Blob([logContent], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `strapi-response-${context}-${timestamp.replace(/[:.]/g, '-')}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            // Server-side logging
            console.log(`API Response Log - ${context}:`, logData);
            
            try {
                // Attempt to write to logs directory in project root
                const filename = `strapi-response-${context}-${timestamp.replace(/[:.]/g, '-')}.json`;
                const logsDir = join(process.cwd(), 'logs');
                
                // Create logs directory if it doesn't exist
                try {
                    await writeFile(join(logsDir, filename), logContent);
                    console.log(`Log file written to: logs/${filename}`);
                } catch (writeError) {
                    // If we can't write to logs directory, write to /tmp
                    const tmpFilename = join('/tmp', filename);
                    await writeFile(tmpFilename, logContent);
                    console.log(`Log file written to: ${tmpFilename}`);
                }
            } catch (fsError) {
                // If all file writing fails, at least we still have console output
                console.error('Failed to write log file:', fsError);
            }
        }
    } catch (error) {
        // Ensure we at least get console output even if file operations fail
        console.error('Error in logApiResponse:', error);
        console.log('Original log data:', logData);
    }
    
    return logContent;
};