# nginx/routes：後端 API 路由

每個 webapi 一個 `<名稱>.conf`。`wt new <語言> webapi` 會自動產生這個檔案，`wt remove` 會自動刪除。

- 路由規則：`/<名稱>/xxx` 轉送到 `http://<名稱>.api/xxx`（前綴會被去掉）。
- 前端以相對路徑呼叫，例：`ajax.Form.Get("/OrderApi/weatherforecast")`。
- 可以修改路徑前綴，例：改成 `/api/order/`。修改後執行 `docker compose exec nginx nginx -s reload`。
