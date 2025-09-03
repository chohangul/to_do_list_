# 로컬 SQLite 할 일 앱

이 프로젝트는 Electron + React + TypeScript로 작성된 로컬 할 일 관리 애플리케이션입니다. 모든 UI와 문서는 한국어를 기본으로 합니다.

## 설치

```bash
pnpm i
```

## 개발 모드 실행

```bash
pnpm dev
```

또는 `scripts/dev.sh` / `scripts/dev.ps1` 사용

## 빌드

```bash
pnpm build
```

## 패키징

```bash
pnpm package
```

생성된 설치 파일은 `dist/` 폴더에 위치합니다.

## DB 이동 및 백업

- 첫 실행 시 DB 파일이 자동 생성됩니다.
- 다른 DB를 사용하려면 메뉴에서 DB를 전환합니다.
- 백업은 설정에서 생성된 sqlite 파일을 복사하면 됩니다.

## Git 원격 저장소 추가 후 푸시

```bash
git remote add origin <원격 URL>
git push -u origin main
```

## FAQ

**문제: 앱이 실행되지 않습니다.**

- Node 20 버전을 사용했는지 확인합니다.
- `pnpm install` 실행 여부를 확인합니다.

**문제: DB가 손상되었습니다.**

- 백업된 sqlite 파일로 교체합니다.
