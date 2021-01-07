import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Stack;
/* public class ReadFile{
public static void main(String[] args) throws IOException {
        String inputFilePath ="/Users/user/Desktop/bookInformation.txt";
        String outputFilPath ="/Users/user/Desktop/abc2.html";
        BufferedWriter fileWriter = Files.newBufferedWriter(Paths.get(outputFilPath));
        Stack<String> lastData= new Stack<>();
        Files.newBufferedReader(Paths.get(inputFilePath)).lines().forEach(test -> {
            switch(test.toLowerCase().charAt(0)){
                case 'q':
                    if(test.contains("best_bid")){
                        Integer price=0,size=0;
                        while (!lastData.empty())
                        {
                            String lastBidData = lastData.pop();
                            if(lastBidData.contains("bid")){
                                String bidData[]=lastBidData.split(",");
                                int priceTemp = Integer.parseInt(bidData[1]);
                                int sizeTemp = Integer.parseInt(bidData[2]);
                                price = price<priceTemp?priceTemp:price;
                                size = size<sizeTemp?sizeTemp:size;
                            }
                        }
                        if(price>0){

                            try {
                                System.out.println(price+","+size+"\n");
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                           // System.out.println("Best Bid - "+price + " : "+ size);
                        }

                    }else if(test.contains("best_ask")){
                        Integer price=0,size=0;
                        while (!lastData.empty())
                        {
                            String lastBidData = lastData.pop();
                            if(lastBidData.contains("ask")){
                                String bidData[]=lastBidData.split(",");
                                int priceTemp = Integer.parseInt(bidData[1]);
                                int sizeTemp = Integer.parseInt(bidData[2]);
                                price = price<priceTemp?priceTemp:price;
                                size = size<sizeTemp?sizeTemp:size;
                            }
                        }
                        if(price>0)
                        {
                            try {
                                System.out.println(price+","+size+"\n");
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                           // System.out.println("Best Ask - "+price + " : "+ size);
                        }

                    }else{
                        while (!lastData.empty()){
                            String lastBidData = lastData.pop();
                            if(lastBidData.startsWith("o")){
                                try {
                                    System.out.println(lastBidData.split(",")[2]);
                                }catch (Exception a){}
                            }
                        }



                    }
                    break;
                case 'u':
                case 'o':
                    lastData.push(test);
                    break;
                default:
                   // System.out.println("Invalid Entry"+ test);
            }


        });
        fileWriter.close();
    }
	} */
	
	
	
	public class ReadFile{
    public static void main(String[] args) throws IOException {
        String inputFilePath ="/Users/user/Desktop/bookInformation.txt";
        String outputFilPath ="/Users/user/Desktop/abc2.html";
        BufferedWriter fileWriter = Files.newBufferedWriter(Paths.get(outputFilPath));
        Stack<String> lastData= new Stack<>();
        Files.newBufferedReader(Paths.get(inputFilePath)).lines().forEach(test -> {
            switch(test.toLowerCase().charAt(0)){
                case 'q':
                    if(test.contains("best_bid")){
                        Integer price=0,size=0;
                        while (!lastData.empty())
                        {
                            String lastBidData = lastData.pop();
                            if(lastBidData.contains("bid")){
                                String bidData[]=lastBidData.split(",");
                                int priceTemp = Integer.parseInt(bidData[1]);
                                int sizeTemp = Integer.parseInt(bidData[2]);
                                price = price<priceTemp?priceTemp:price;
                                size = size<sizeTemp?sizeTemp:size;
                            }
                        }
                        if(price>0){

                           // try {
                                System.out.println(price+","+size+"\n");
//                            } catch (IOException e) {
//                                e.printStackTrace();
//                            }
                          //  System.out.println("Best Bid - "+price + " : "+ size);
                        }

                    }else if(test.contains("best_ask")){
                        Integer price=0,size=0;
                        while (!lastData.empty())
                        {
                            String lastBidData = lastData.pop();
                            if(lastBidData.contains("ask")){
                                String bidData[]=lastBidData.split(",");
                                int priceTemp = Integer.parseInt(bidData[1]);
                                int sizeTemp = Integer.parseInt(bidData[2]);
                                price = price<priceTemp?priceTemp:price;
                                size = size<sizeTemp?sizeTemp:size;
                            }
                        }
                        if(price>0)
                        {
                            //try {
                                System.out.println(price+","+size+"\n");
                           /* } catch (IOException e) {
                                e.printStackTrace();
                            }*/
                            //System.out.println("Best Ask - "+price + " : "+ size);
                        }

                    }else{
                        while (!lastData.empty()){
                            String lastBidData = lastData.pop();
                            if(lastBidData.startsWith("o")){
                                try {
                                    System.out.println(lastBidData.split(",")[2]);
                                }catch (Exception a){}
                            }
                        }



                    }
                    break;
                case 'u':
                case 'o':
                    lastData.push(test);
                    break;
                default:
                 //   System.out.println("Invalid Entry"+ test);
            }


        });
        fileWriter.close();
    }
}