"""Use ChatGPT to tag posts
Expects the OpenAI API key to be in the OPENAI_API_SECRET variable (in a .env file)"""
from dotenv import load_dotenv
import openai
from openai import OpenAI
import io
import frontmatter
import glob
import os
import time

DIRECTORY="../_posts"

def get_text_tags(openai_client, text):
    prompt = f"""generate tags for the following text. Output should be a list of one tag per line.
Tags should correspond to the contents of the text
Text: "{text}"
"""
    response = openai_client.chat.completions.create(model="gpt-3.5-turbo", temperature=0.0, messages=[{ "role": "user", "content": prompt}])
    for choice in response.choices:
        if choice.finish_reason == 'stop':
            return [line.removeprefix("-").strip() for line in choice.message.content.split('\n')]
    return None

load_dotenv()

client = OpenAI(api_key=os.environ["OPENAI_API_SECRET"])

filenames = glob.glob(f"{DIRECTORY}/*.md") + glob.glob(f"{DIRECTORY}/*.markdown")
for fname in filenames:
    done = False
    while not done:
        print(f'{fname}: ', end='', flush=True)
        with io.open(fname, 'r') as f:
            post = frontmatter.load(f)
        if 'tags' not in post.metadata.keys():
            try:
                tags = get_text_tags(client, post.content)
                post.metadata['tags'] = tags
                with io.open(fname, 'wb') as f:
                    frontmatter.dump(post, f)
                print('!')
                time.sleep(20)
            except openai.RateLimitError:
                print('zzz...', end='', flush=True)
                time.sleep(8 * 60)
                continue
        else:
            print('.')
        done = True


