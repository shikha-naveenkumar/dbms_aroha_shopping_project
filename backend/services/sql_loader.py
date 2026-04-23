import os
import re

# Path to queries.sql
QUERIES_FILE = os.path.join(os.path.dirname(__file__), '..', '..', 'database', 'queries.sql')

_queries_cache = {}

def _load_queries():
    """Parse queries.sql and cache queries by their @name tag."""
    global _queries_cache
    if _queries_cache:
        return _queries_cache

    with open(QUERIES_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by @name tags
    pattern = r'--\s*@name:\s*(\w+)\s*\n(.*?)(?=--\s*@name:|\Z)'
    matches = re.findall(pattern, content, re.DOTALL)

    for name, query in matches:
        # Clean up the query - remove comments and extra whitespace
        lines = []
        for line in query.strip().split('\n'):
            stripped = line.strip()
            if stripped and not stripped.startswith('--'):
                lines.append(line)
        clean_query = '\n'.join(lines).strip().rstrip(';')
        if clean_query:
            _queries_cache[name] = clean_query

    print(f"✅ Loaded {len(_queries_cache)} SQL queries from queries.sql")
    return _queries_cache

def get_query(name):
    """Get a named SQL query from queries.sql."""
    queries = _load_queries()
    if name not in queries:
        raise ValueError(f"Query '{name}' not found in queries.sql")
    return queries[name]

def list_queries():
    """List all available query names."""
    queries = _load_queries()
    return list(queries.keys())
