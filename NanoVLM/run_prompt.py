import os
import sys
import time

def send_input(input_text):
    sys.stdout.write(input_text + "\n")
    sys.stdout.flush()

# Load medical prompt
with open(os.path.join(os.path.dirname(__file__), 'medical_prompt.txt'), 'r') as f:
    medical_prompt = f.read().strip()

# Start the initial process and get its output pipe
print("Starting model...")
process = os.popen("jetson-containers run --volume /home/jetson/nanollm_project:/workspace/nanollm_project $(autotag nano_llm) python3 -m nano_llm.chat --api=mlc --model Efficient-Large-Model/VILA1.5-3b --max-context-len 256 --max-new-tokens 128 --disable-streaming --disable-stats")

# When first PROMPT appears, send image path
while True:
    line = process.readline()
    print(line.strip())
    if 'PROMPT' in line:
        send_input("/workspace/nanollm_project/models/legulcer.jpeg")
        break

# When second PROMPT appears, send medical prompt
while True:
    line = process.readline()
    print(line.strip())
    if 'PROMPT' in line:
        send_input(medical_prompt)
        break

# Print remaining output
for line in process:
    print(line.strip())