const fs = require('fs');
const path = require('path');

const schemaDir = path.join(__dirname, '../prisma/schema');
const mainSchemaPath = path.join(__dirname, '../prisma/schema.prisma');

// Read the base configuration
let baseConfig = fs.readFileSync(
  path.join(__dirname, '../prisma/schema.prisma'),
  'utf8'
)
.split('\n')
.filter(line => 
  line.trim().startsWith('datasource') || 
  line.trim().startsWith('generator') ||
  (line.trim() !== '' && !line.trim().startsWith('include'))
)
.join('\n');

// Store definitions with their names as keys
const definitions = new Map();

const schemaFiles = [
  'base.prisma',
  'tracking.prisma',
  'assets.prisma',
  'transfers.prisma',
  'testing.prisma',
  'activity.prisma'
];

function extractDefinitionName(firstLine) {
  const match = firstLine.match(/^(model|enum)\s+(\w+)/);
  return match ? match[2] : null;
}

for (const file of schemaFiles) {
  console.log(`Processing ${file}...`);
  const content = fs.readFileSync(path.join(schemaDir, file), 'utf8');
  const lines = content.split('\n');
  
  let isCollecting = false;
  let currentDefinition = [];
  let currentName = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.trim().startsWith('model ') || line.trim().startsWith('enum ')) {
      if (isCollecting) {
        console.warn(`Warning: Found nested definition in ${file} at line ${i + 1}`);
      }
      isCollecting = true;
      currentDefinition = [line];
      currentName = extractDefinitionName(line);
      continue;
    }
    
    if (isCollecting) {
      currentDefinition.push(line);
      if (line.trim() === '}') {
        if (currentName) {
          if (!definitions.has(currentName)) {
            definitions.set(currentName, currentDefinition.join('\n'));
            console.log(`Added definition for ${currentName}`);
          } else {
            console.log(`Skipping duplicate definition for ${currentName} in ${file}`);
          }
        }
        isCollecting = false;
        currentDefinition = [];
        currentName = null;
      }
    }
  }
}

// Combine everything
let combinedSchema = baseConfig + '\n\n';
combinedSchema += Array.from(definitions.values()).join('\n\n');

// Write the combined schema
fs.writeFileSync(mainSchemaPath, combinedSchema);
console.log('\nFinal definitions:', Array.from(definitions.keys()).join(', '));
console.log('\nSchema files combined successfully!');