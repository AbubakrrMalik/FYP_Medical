## Setup Instructions 
Open the backendfastapi folder in Windows Command Prompt, then run the following commands:

### Create Python Environment 

```bash
python -m venv env
```

### Activate Python Environment

```bash
env\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run the Server

```bash
uvicorn main:app --host 0.0.0.0 --port 5001
```
