#!/bin/bash

symbols=("AAPL" "GOOGL" "MSFT" "AMZN" "FB" "TSLA" "NFLX" "NVDA")

generate_price() {
  echo $(awk -v min=1 -v max=1000 'BEGIN{srand(); print int(min+rand()*(max-min+1))}')
}

generate_news() {
  titles=("Market Soars" "Tech Stocks Plummet" "New Regulations Announced" "Earnings Reports Surprise Investors")
  title=${titles[$RANDOM % ${#titles[@]}]}
  echo "{\"title\":\"$title\",\"content\":\"Lorem ipsum dolor sit amet.\"}"
}

for i in {1..50}; do
  symbol=${symbols[$RANDOM % ${#symbols[@]}]}
  price=$(generate_price)
  curl -X POST -H "Content-Type: application/json" -d "{\"symbol\":\"$symbol\",\"price\":$price}" http://localhost:3000/update-price
done

for i in {1..10}; do
  news=$(generate_news)
  curl -X POST -H "Content-Type: application/json" -d "$news" http://localhost:3001/publish-news
done