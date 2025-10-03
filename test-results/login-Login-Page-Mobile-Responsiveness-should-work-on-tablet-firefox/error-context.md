# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e8]:
    - generic [ref=e9]:
      - generic [ref=e10]: เข้าสู่ระบบ
      - generic [ref=e11]: เข้าสู่ระบบเพื่อจองคิวและใช้บริการสปาของเรา
      - generic [ref=e13]:
        - generic [ref=e14]:
          - paragraph [ref=e15]: "Email: user@demo.com"
          - paragraph [ref=e16]: "Password: demo123"
        - button "Auto Fill" [ref=e17]
    - generic [ref=e19]:
      - generic [ref=e20]:
        - generic [ref=e21]:
          - generic [ref=e22]: Email
          - textbox "Email" [ref=e23]
        - generic [ref=e24]:
          - generic [ref=e25]:
            - generic [ref=e26]: Password
            - link "ลืมรหัสผ่าน?" [ref=e27] [cursor=pointer]:
              - /url: /auth/forgot-password
          - textbox "Password" [ref=e28]
        - button "เข้าสู่ระบบ" [ref=e29]
      - generic [ref=e30]:
        - text: Don't have an account?
        - link "Sign up" [ref=e31] [cursor=pointer]:
          - /url: /auth/sign-up
  - region "Notifications (F8)":
    - list
```