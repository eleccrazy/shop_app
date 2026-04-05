function randomSegment() {
  return Math.random().toString(36).slice(2, 10);
}

export function createDocumentId(prefix?: string) {
  const baseId = `${Date.now().toString(36)}${randomSegment()}${randomSegment()}`;

  return prefix ? `${prefix}_${baseId}` : baseId;
}
