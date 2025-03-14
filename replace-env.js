import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

config();

const configPath = path.join(process.cwd(), 'config.json');
const configContent = fs.readFileSync(configPath, 'utf8');

const updatedConfig = configContent.replace(/\$(\w+)/g, (_, key) => {
  return process.env[key] || '';
});

fs.writeFileSync(configPath, updatedConfig, 'utf8');

console.log('Environment variables injected into config.json');