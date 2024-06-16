import getServerSideProps from "@/actions/get-store";
import axios from "axios";

jest.mock("axios");

describe("getServerSideProps", () => {
  it("fetches successfully data from an API", async () => {
    const data = {
      StoreDoc: {
        _id: "65344709f37c16aa365c3acd",
        name: "Portland Kappa",
        userId: "65c06d894f5338bff32d39e2",
        billboards: [
          "65344cc7f37c16aa365c3bd9",
          "65f3ac0e393824b8b079acc2",
          "65f96d3ccef2eb2f66245db2",
        ],
        categories: [[Object]],
        products: [[Object], [Object], [Object], [Object]],
        orders: [],
        createdAt: "2023-10-21T21:47:53.060Z",
        updatedAt: "2024-03-23T03:40:22.909Z",
        __v: 0,
        activeBillboard: {
          _id: "65f3ac0e393824b8b079acc2",
          userId: "65c06d894f5338bff32d39e2",
          storeId: "65344709f37c16aa365c3acd",
          store: "65344709f37c16aa365c3acd",
          label: "KAPPA DARK COFFEE",
          imageUrl:
            "https://novarise-billboards-upload.s3.amazonaws.com/Untitled%20design.png",
          categories: [],
          active_billboard: true,
          createdAt: "2024-03-15T02:01:51.006Z",
          updatedAt: "2024-03-19T11:03:35.952Z",
          __v: 0,
        },
      },
      success: true,
    };

    const response = { data };

    (axios.get as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(response),
    );
    await expect(getServerSideProps()).resolves.toEqual(response.data);
    expect(axios.get).toHaveBeenCalledWith(expect.any(String), {
      headers: { "Cache-Control": "no-cache" },
    });
  });

  it("handles errors from the API", async () => {
    const errorMessage = "Error message goes here";

    (axios.get as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error(errorMessage)),
    );

    await expect(getServerSideProps()).rejects.toThrow(errorMessage);

    expect(axios.get).toHaveBeenCalledWith(expect.any(String), {
      headers: { "Cache-Control": "no-cache" },
    });
  });
});
