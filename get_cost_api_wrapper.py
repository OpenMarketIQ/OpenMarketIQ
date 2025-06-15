import os
import sys
import subprocess

def main():
    api_key = os.environ.get("PERPLEXITY_API_KEY")
    item = os.environ.get("PERPLEXITY_ITEM")
    if not api_key or not item:
        print('{"cost": null, "citation": null}', flush=True)
        sys.exit(1)
    # Run get_cost.py as a subprocess, passing the API key and item via stdin
    process = subprocess.run(
        [sys.executable, "get_cost.py"],
        input=f"{api_key}\n{item}\n",
        capture_output=True,
        text=True,
        timeout=30
    )
    # Find the last line that looks like JSON
    output_lines = process.stdout.strip().splitlines()
    for line in reversed(output_lines):
        if line.strip().startswith('{') and line.strip().endswith('}'):  # crude JSON check
            print(line.strip(), flush=True)
            return
    print('{"cost": null, "citation": null}', flush=True)

if __name__ == "__main__":
    main() 