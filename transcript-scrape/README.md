# Trieve Ingest for Philosophize This Podcast

## Setup

### Node 

You must use Node `v20.12.2` for this script. 

If you use `nvm` then you can simply run `nvm use` from the root of this repo. 

### Install Packages 

`npm install` 

### Environment Variables

```
cp .env .env.dist
```

Then, you have two options to get environment variables for Trieve:

#### Use dashboard.trieve.ai

1. Go to [https://dashboard.trieve.ai] and register or sign in
2. Press "create dataset" from the page for your automatically created organization
3. Copy the `DATASET_ID` value to your `.env` as the value for `TRIEVE_DATASET_ID` 
4. Create a new `owner level` `API_KEY` and copy its value for `TRIEVE_API_KEY`

#### Use the CLI

Warning! You must have `cargo` and some build tools installed to use the CLI. 

```
cargo install trieve 
trieve login
trieve api-key generate
trieve dataset create
```

Then copy your `API_KEY` value to the `.env` file for `TRIEVE_API_KEY` and the `DATASET_ID` for `TRIEVE_DATASET_ID`

## Running the Script to Ingest to Trieve

`npm run ingest`
